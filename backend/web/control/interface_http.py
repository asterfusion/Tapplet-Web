#!/usr/bin/python3
import asyncio
import datetime
import json
import sqlite3
import sys
sys.path.append('./web/config/')
sys.path.append('./web/database/')
sys.path.append('./web/control/')
import threading
import time
from Logconfig import Web_log
from concurrent.futures import ThreadPoolExecutor
import uuid
import socket
import requests
import tornado.autoreload
import urllib3
import re
import subprocess
from tornado.concurrent import run_on_executor

import dataconfig
import database_default
import databasetime
import RestApiLogin
import static_interface
import statistic

urllib3.disable_warnings()

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
		
	@run_on_executor	
	def GetStat(self,Xid):
		data1=json.loads(RestApiLogin.r.get(url=dataconfig.stat_url,verify=False).text)
		global Stat_Dict
		Stat_Dict={}
		if (Xid!='All'):
			try:
				str1=Stat(Xid,data1[Xid]["in_packets"],data1[Xid]["in_bps"]/1000000,data1[Xid]["in_pps"]/1000000,data1[Xid]["out_packets"],data1[Xid]["out_bps"]/1000000,data1[Xid]["out_pps"]/1000000).__dict__
			except:
				return ("Xid=%s is wrong!\nit must be X1~X2 or G1~G8"%Xid)
		else:
			for num in range(1,17):
				str1='G'+str(num)
				Stat_Dict[str1]=(Stat(str1,round(data1[str1]["in_packets"],3),
				round(data1[str1]["in_bps"]/1000000,3),
				round(data1[str1]["in_pps"]/1000000,3),
				round(data1[str1]["out_packets"],3),
				round(data1[str1]["out_bps"]/1000000,3),
				round(data1[str1]["out_pps"]/1000000,3)).__dict__)
			return Stat_Dict		
		return str1
		
	def DeleteDbdata():
		while(True):
			time_str=databasetime.GetTime()
			time.sleep(int(time_str))
			con = sqlite3.connect(database_default.interface_db)
			c=con.cursor()
			c.execute("Delete from in_out_day")
			con.commit()
			con.close()
			
		
	def InsertDbdata():
		while(True):
			sum_in=0
			sum_out=0
			try:
				data=json.loads(RestApiLogin.r.get(url=dataconfig.stat_url,verify=False).text)
				for num in range(1,static_interface.num_dict+1):
					str1='G'+str(num)
					sum_in=int(data[str1]["in_bps"])+sum_in
					sum_out=int(data[str1]["out_bps"])+sum_out
			except:
				Web_log.info("can't connect restApi")
			time_ob=(datetime.datetime.now())
			str_time = datetime.datetime.strftime(time_ob,'%H:%M')
			str_time_day = datetime.datetime.strftime(time_ob,'%D')
			#str_time=time.strftime("%H:%M",time.localtime())			##开启服务器时可能会有一分钟读不到信息
			con = sqlite3.connect(database_default.interface_db)
			c=con.cursor()
			try:
				c.execute("INSERT INTO in_out_day (time_day,in_Gbps,out_Gbps,day) VALUES('%s',%.3f,%.3f,'%s')"%(str_time,float(sum_in)/float(1000000000),float(sum_out)/float(1000000000),str_time_day)) #10^9
			except:
				c.execute("Select day from in_out_day where time_day='%s'"%str_time)
				day_db=c.fetchone()[0]
				if day_db!=str_time_day:
					c.execute("Delete from in_out_day")
					c.execute("INSERT INTO in_out_day (time_day,in_Gbps,out_Gbps,day) VALUES('%s',%.3f,%.3f,'%s')"%(str_time,float(sum_in)/float(1000000000),float(sum_out)/float(1000000000),str_time_day)) #10^9
				else:
					pass
			con.commit()
			con.close()
			#try:
			static_interface.Stat.GetStat('All')
			static_interface.Status.GetStatus()
			static_interface.System_info.GetSystemInfo()
			static_interface.System_info.GetSystemUsing()
			#except:
			#	Web_log.info("can't connect restApi")
			time.sleep(5)
			time_str=databasetime.GetTimeMinute()
			time.sleep(int(time_str))		
	@run_on_executor		
	def ListDbdata(self):
		con = sqlite3.connect(database_default.interface_db)
		c=con.cursor()
		list1=[1]
		nowtime=(datetime.datetime.now())
		for i in range(1,16):
			time_ob=(nowtime-datetime.timedelta(minutes=i))
			timestr = datetime.datetime.strftime(time_ob,'%H:%M')
			c.execute("select time_day,in_Gbps,out_Gbps from in_out_day where time_day ='%s'"%timestr)
			db_result = c.fetchone()
			if db_result:
				time_day=db_result[0]
				in_Gbps=db_result[1]
				out_Gbps=db_result[2]
				list1.insert(1,{"time":time_day,"type":"tx","value":out_Gbps})
				list1.insert(1,{"time":time_day,"type":"rx","value":in_Gbps})
			else :
				time_day=timestr
				in_Gbps=0
				out_Gbps=0
				list1.insert(1,{"time":time_day,"type":"tx","value":out_Gbps})
				list1.insert(1,{"time":time_day,"type":"rx","value":in_Gbps})
		list1=list1[1:]
		con.close()
		return list1		


class Status:
	def __init__(self,link_status,admin_status,speed):
		self.link_status=link_status
		self.admin_status=admin_status
		self.speed=speed
		
	@run_on_executor	
	def GetStatus(self):
		Status_Dict={}
		data=json.loads(RestApiLogin.r.get(url=dataconfig.status_url).text)
		for num in range(1,17):
			str1='G'+str(num)
			str2=Status(data[str1]["link_status"],data[str1]["admin_status"],data[str1]["speed"]).__dict__
			Status_Dict[str1]=str2
		return Status_Dict


class System_info:
	"""
	系统信息
	"""
	def __init__(self,hostname,nos_version,Mgmt_Ip,Mgmt_Mac,Mgmt_Mask):
		self.hostname=hostname
		self.product_name='NF5000'
		self.nos_version=nos_version
		self.Mgmt_Ip=Mgmt_Ip
		self.Mgmt_Mac=Mgmt_Mac
		self.Mgmt_Mask=Mgmt_Mask
	@run_on_executor	
	def GetSystemInfo(self):
		Mgmt_Mac=get_mac_address()
		myname = socket.getfqdn(socket.gethostname(  ))
		Mgmt_IP = socket.gethostbyname(myname)
		output = subprocess.Popen(["ifconfig"], stdout=subprocess.PIPE).communicate()[0].decode("gbk") 
		Mask_sub = re.findall(r'Mask:(.\S*)',output)[0]
		data1=json.loads(RestApiLogin.r.get(url=dataconfig.systeminfo_url,verify=False).text)
		global Systeminfo_Dict
		Systeminfo_Dict=System_info(data1['platform'],data1['sf_version'],Mgmt_IP,Mgmt_Mac,Mask_sub).__dict__
		return Systeminfo_Dict
	@run_on_executor	
	def GetSystemUsing(self):
		data=json.loads(RestApiLogin.r.get(url=dataconfig.systemusing_url,verify=False).text)
		try:
			data["mem"]["usage"]=round(data["mem"]["usage"],2)
		except:
			pass
		global SystemUsing_Dict
		SystemUsing_Dict={"cpu_usage":data["cpu"]["0"],"memory_usage":data["mem"]["usage"]}
		return SystemUsing_Dict
		
def start_listen():
	t1 = threading.Thread(target=Stat.InsertDbdata, args=(), name='InsertDbdata')
	t2 = threading.Thread(target=Stat.DeleteDbdata, args=(), name='DeleteDbdata')
	t3 = threading.Thread(target=RestApiLogin.Logintest, args=(), name='Relogin')	
	t1.start() 
	t2.start()
	t3.start()
	t4 = threading.Thread(target=statistic.write_statistic_data, args=(), name='get_statistic_data')
	t4.start()


class config:
	"""
	修改端口配置
	"""
	def __init__(self,deduplication,default_action_id,rule_group,rule_to_action,tuple_mode,Xid):
		self.deduplication=deduplication
		self.default_action_id=default_action_id
		self.rule_group=rule_group
		self.rule_to_action=rule_to_action
		self.tuple_mode=tuple_mode
		self.Xid=Xid
	@run_on_executor
	def replace_deduplication(self,list1):
		data1=[]
		for str1 in list1[0]:
			data1.append({"op": "replace", "path": "/%s/deduplication_enable"%str1, "value": list1[1]})
			if list1[2]!='':
				for key,value in list1[2].items():
					data1.append({"op":"replace","path":"/%s/deduplication_cfg/%s"%(str1,key),"value":value})
			else:
				pass
		data1=json.dumps(data1)
		res= RestApiLogin.r.patch(url=dataconfig.interface_url,data=data1,verify=False)
		if res.status_code==200:
			return True
		else:
			return False
	@run_on_executor	
	def replace_tuple_mode(self,list1):
		data1=[]
		for str1 in list1[0]:
			data1.append({"op": "add", "path": "/%s/ingress_config/tuple_mode"%str1, "value": list1[1]})
		data1=json.dumps(data1)
		res=RestApiLogin.r.patch(url=dataconfig.interface_url,data=data1,verify=False)
		if res.status_code==200:
			return True
		else:
			return False
		
	@run_on_executor
	def get_config_info(self,str1):
		res=RestApiLogin.r.get(url=dataconfig.interface_url+'/'+str1,verify=False).text
		data=json.loads(res)
		X1=config(data[str1]["deduplication_enable"],data[str1]["ingress_config"]["default_action_id"],data[str1]["ingress_config"]["rule_group"],data[str1]["ingress_config"]["rule_to_action"],data[str1]["ingress_config"]["tuple_mode"],str1)
		return X1


if __name__=="__main__":
	#t1 = threading.Thread(target=Stat.InsertDbdata, args=(), name='InsertDbdata')
	#t2 = threading.Thread(target=Stat.DeleteDbdata, args=(), name='DeleteDbdata')	
	#t1.start() 
	#t2.start()
	#print(System_info.GetSystemUsing())
	pass
