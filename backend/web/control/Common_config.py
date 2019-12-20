	#!/usr/bin/python3
import sqlite3
import json
import threading
import requests
import urllib3
import datetime
import time
import asyncio
import tornado.autoreload
import os 
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
sys.path.append('../config')
sys.path.append('../database')
from Logconfig import Web_log
import Rule
import database_default
import data_operation
import RestApiLogin
import dataconfig
urllib3.disable_warnings()
vpp_stat='RUNNING'

def start_vpp():
	global vpp_stat
	os.system("systemctl start vpp")
	i=0
	while(i<30):
		re=RestApiLogin.r.get(url=dataconfig.systemusing_url,verify=False)
		if re.status_code==200:
			if json.loads(re.text)["vpp"]["Status"]=="RUNNING":
				vpp_stat='RUNNING'
				return True
			else:
				i+=1
		else:
			i+=1
		time.sleep(0.3)
	return False
	#except:
	#	return False
def stop_vpp():
	global vpp_stat
	os.system("systemctl stop vpp")
	i=0
	while(i<30):
		re=RestApiLogin.r.get(url=dataconfig.systemusing_url,verify=False)
		if re.status_code==200:
			if json.loads(re.text)["vpp"]["Status"]=="SHUTDOWN":
				vpp_stat='SHUTDOWN'
				return True
			else:
				i+=1
		else:
			i+=1
		time.sleep(0.3)
	return False
	#except:
	#	return False

def get_vpp_status():
	try:
		vpp_i=0
		while(vpp_i<30):
			re=RestApiLogin.r.get(url=dataconfig.systemusing_url,verify=False)
			if re.status_code==200:
				if json.loads(re.text)["vpp"]["Status"]=='RUNNING' or json.loads(re.text)["vpp"]["Status"]=='SHUTDOWN':
					data=json.loads(re.text)["vpp"]["Status"]
					return data
			else:
				time.sleep(0.5)
	except:
		return False
		
vpp_stat=get_vpp_status()

def patch_hostname(data1):
	try:
		hostname=data1['hostname']
		if os.system("hostname %s"%hostname)==0:
			fo=open("/etc/hostname","w")
			fo.write(hostname)
			fo.close()
			return True
		else:
			return False
	except:
		return False
"""
形式：
get:
data={"name":"ip_reassembly"}
post:
data={"name":"ip_reassembly","config":config}
config={
    "ipreassembly_inner_switch": 1,
    "ipreassembly_outer_switch": 1,
    "max_pkt_num": 500000,
    "time_out": 20
}
"""