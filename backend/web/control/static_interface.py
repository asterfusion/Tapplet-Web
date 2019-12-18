#!/usr/bin/python3
import asyncio
import datetime
import json
import sqlite3
import sys
sys.path.append('./web/config/')
sys.path.append('./web/database/')
sys.path.append('./web/control/')
sys.path.append('./')
import threading
import time
import uuid
import configparser
import subprocess
import socket
import requests
import tornado.autoreload
import urllib3
import RestApiLogin
import database_default
import databasetime
import dataconfig
import Common_config
import re
import Reset
urllib3.disable_warnings()

Status_Dict={}
Stat_Dict={}
Systeminfo_Dict={}
SystemUsing_Dict={}
Stat_Hour_Dict={}
Stat_Hour_num=0
num_dict=0

class Stat_Hour:
	def __init__(self,Xid,drop_packets,in_bps,in_octets,in_packets,in_pps,out_bps,out_octets,out_packets,out_pps):
		self.Xid=Xid
		self.drop_packets=drop_packets
		self.in_octets=in_octets
		self.in_bps=in_bps
		self.in_packets=in_packets
		self.in_pps=in_pps
		self.out_packets=out_packets
		self.out_bps=out_bps
		self.out_octets=out_octets
		self.out_pps=out_pps
	
	def get_Stat_Hour():
		global Stat_Hour_Dict
		global Stat_Hour_num
		for i in range(1,num_dict+1):
			str1="G"+str(i)
			Stat_Hour_Dict[str1]["in_bps"]=Stat_Hour_Dict[str1]["in_bps"]/Stat_Hour_num
			Stat_Hour_Dict[str1]["in_pps"]=Stat_Hour_Dict[str1]["in_pps"]/Stat_Hour_num
			Stat_Hour_Dict[str1]["out_bps"]=Stat_Hour_Dict[str1]["out_bps"]/Stat_Hour_num
			Stat_Hour_Dict[str1]["out_pps"]=Stat_Hour_Dict[str1]["out_pps"]/Stat_Hour_num
		data_hour=Stat_Hour_Dict
		return data_hour

	def reset_Stat_Hour():
		global Stat_Hour_Dict
		global Stat_Hour_num
		for i in range(1,num_dict+1):
			str1="G"+str(i)
			Stat_Hour_Dict[str1]=(Stat_Hour(str1,0,0,0,0,0,0,0,0,0).__dict__)
		Stat_Hour_num=0




def get_mac_address(): 
    mac=uuid.UUID(int = uuid.getnode()).hex[-12:] 
    return ":".join([mac[e:e+2] for e in range(0,11,2)])

class Stat:
	def __init__(self,Xid,in_packets,in_bps,in_pps,out_packets,out_bps,out_pps):
		self.id=Xid
		self.in_packets=in_packets
		self.in_bps=in_bps
		self.in_pps=in_pps
		self.out_packets=out_packets
		self.out_bps=out_bps
		self.out_pps=out_pps
		

	def GetStat(Xid):
		data1=json.loads(RestApiLogin.r.get(url=dataconfig.stat_url,verify=False).text)
		global Stat_Dict
		global Stat_Hour_Dict
		global Stat_Hour_num
		Stat_Dict={}
		if (Xid!='All'):
			try:
				str1=Stat(Xid,data1[Xid]["in_packets"],data1[Xid]["in_bps"]/1000000,data1[Xid]["in_pps"]/1000000,data1[Xid]["out_packets"],data1[Xid]["out_bps"]/1000000,data1[Xid]["out_pps"]/1000000).__dict__
			except:
				return ("Xid=%s is wrong!\nit must be X1~X2 or G1~G8"%Xid)
		else:
			for num in range(1,num_dict+1):
				str1='G'+str(num)
				Stat_Dict[str1]=(Stat(str1,round(data1[str1]["in_packets"],3),
				round(data1[str1]["in_bps"]/1000000,3),
				round(data1[str1]["in_pps"]/1000000,3),
				round(data1[str1]["out_packets"],3),
				round(data1[str1]["out_bps"]/1000000,3),
				round(data1[str1]["out_pps"]/1000000,3)).__dict__)
				Stat_Hour_Dict[str1]=(Stat_Hour(str1,data1[str1]["drop_packets"],
				data1[str1]["in_bps"]+Stat_Hour_Dict[str1]["in_bps"],
				data1[str1]["in_octets"],data1[str1]["in_packets"],
				data1[str1]["in_pps"]+Stat_Hour_Dict[str1]["in_pps"],
				data1[str1]["out_bps"]+Stat_Hour_Dict[str1]["out_bps"],
				data1[str1]["out_octets"],data1[str1]["out_packets"],data1[str1]["out_pps"]+Stat_Hour_Dict[str1]["out_pps"]).__dict__)	
			for num in range(num_dict+1,17):
				str1='G'+str(num)
				Stat_Dict[str1]={}	
			"""
			Stat_Dict["G3"]=(Stat("G3",0,0,0,0,0,0).__dict__)
			Stat_Dict["G4"]=(Stat("G4",0,0,0,0,0,0).__dict__)
			Stat_Dict["G5"]=(Stat("G5",0,0,0,0,0,0).__dict__)
			Stat_Dict["G6"]=(Stat("G6",0,0,0,0,0,0).__dict__)
			Stat_Dict["G7"]=(Stat("G7",0,0,0,0,0,0).__dict__)
			Stat_Dict["G8"]=(Stat("G8",0,0,0,0,0,0).__dict__)
			Stat_Dict["X1"]=(Stat("X1",0,0,0,0,0,0).__dict__)
			Stat_Dict["X2"]=(Stat("X2",0,0,0,0,0,0).__dict__)
			"""
			Stat_Hour_num+=1
			return Stat_Dict		
		return str1
		


class Status:
	def __init__(self,link_status,admin_status,speed):
		self.link_status=link_status
		self.admin_status=admin_status
		self.speed=speed
	
	def GetStatus():
		global r
		global Status_Dict
		Status_Dict={}
		data=json.loads(RestApiLogin.r.get(url=dataconfig.status_url).text)
		for num in range(1,num_dict+1):
			str1='G'+str(num)
			if int(data[str1]["admin_status"])==1:
				data[str1]["admin_status"]='up'
			else:
				data[str1]["admin_status"]='down'
			if data[str1]["speed"]=='Unknown':
				data[str1]["speed"]=0
			if Common_config.vpp_stat=='SHUTDOWN':
				data[str1]["link_status"]='down'
				data[str1]["admin_status"]='down'
			str2=Status(data[str1]["link_status"],data[str1]["admin_status"],data[str1]["speed"]).__dict__
			Status_Dict[str1]=str2
		for num in range(num_dict+1,17):
			str1='G'+str(num)
			Status_Dict[str1]={}	
		"""
		button=['down',0]
		Status_Dict["G3"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["G4"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["G5"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["G6"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["G7"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["G8"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["X1"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		Status_Dict["X2"]={"link_status":button[0],"admin_status":button[1],"speed":"Unknown"}
		"""
		
		return Status_Dict


class System_info:
	"""
	系统信息
	"""
	def __init__(self,hostname,nos_version,Mgmt_Ip,Mgmt_Mac,Mgmt_Mask):
		self.hostname=hostname
		self.product_name='Tapplet_Basic'
		self.nos_version=nos_version
		self.Mgmt_Ip=Mgmt_Ip
		self.Mgmt_Mac=Mgmt_Mac
		self.Mgmt_Mask=Mgmt_Mask
		
	def GetSystemInfo():
		global r
		Mgmt_Mac=get_mac_address()
		output = subprocess.Popen(["ifconfig"], stdout=subprocess.PIPE).communicate()[0].decode("gbk") 
		Mask_sub = re.findall(r'Mask:(.\S*)',output)[0]
		Mask_Ip = re.findall(r'inet addr:(.\S*) ',output)[0]
		hostname = socket.gethostname()
		data1=json.loads(RestApiLogin.r.get(url=dataconfig.systeminfo_url,verify=False).text)
		global Systeminfo_Dict
		Systeminfo_Dict=System_info(hostname,data1['sf_version'],Mask_Ip,Mgmt_Mac,Mask_sub).__dict__
		return Systeminfo_Dict
		
	def GetSystemUsing():
		global r
		data=json.loads(RestApiLogin.r.get(url=dataconfig.systemusing_url,verify=False).text)
		try:
			data["mem"]["usage"]=round(data["mem"]["usage"],2)
		except:
			pass
		global SystemUsing_Dict
		SystemUsing_Dict={"cpu_usage":data["cpu"]["0"],"memory_usage":data["mem"]["usage"]}
		return SystemUsing_Dict


def GetNumOfSys():
	global r
	global num_dict
	#try:
	dict1=json.loads(RestApiLogin.r.get(url=dataconfig.interface_url).text)
	num_dict=len(dict1)
	#except:
	#	num_dict=0
	cp=configparser.ConfigParser()
	cp.read('./data/WorldTime.cfg')
	id1=cp.get('Port','Port_num')
	id1=int(id1)
	if id1!=num_dict:
		cp.set('Port','Port_num',str(num_dict))
		cp.write(open('./data/WorldTime.cfg', 'w'))
		Reset.reset_policy()
	return num_dict

GetNumOfSys()
Stat_Hour.reset_Stat_Hour()