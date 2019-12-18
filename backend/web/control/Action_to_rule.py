#!/usr/bin/python3
import asyncio
import datetime
import json
import sqlite3
import sys
sys.path.append('./web/config/')
sys.path.append('./web/control/')
sys.path.append('./web/database/')
import threading
import time
from concurrent.futures import ThreadPoolExecutor

import requests
import tornado.autoreload
import urllib3
from tornado.concurrent import run_on_executor

import dataconfig
import data_operation
import database_default
import RestApiLogin
import Lag


urllib3.disable_warnings()

def default_action(inname,outname):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select interlist from ingroup where name = '%s'"%inname)
	result_in=c.fetchone()
	c.execute("select actid from action where name = '%s'"%outname)
	result_out=c.fetchone()
	act_def_id=result_out[0]
	if result_in and result_out:
		list1=json.loads(result_in[0])
		for value in list1:
			data1=[{"op":"replace","path":"/%s/ingress_config/default_action_id"%value,"value":act_def_id}]
			ce=RestApiLogin.r.patch(url=dataconfig.interface_url,data=json.dumps(data1),verify=False)
			Lag.setDefaultInterface(value,1)
			c.execute("Update rulegroup set isdefault=1 where ingroupname='%s' and outgroupname='%s'"%(inname,outname))
			con.commit()
		con.close()
		return True
	else:
		con.close()
		return False

def remove_default_action(inname,outname):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select interlist from ingroup where name = '%s'"%inname)
	result_in=c.fetchone()
	c.execute("select actid from action where name = '%s'"%outname)
	result_out=c.fetchone()
	if result_in and result_out:
		list1=json.loads(result_in[0])
		for value in list1:
			data1=[{"op":"replace","path":"/%s/ingress_config/default_action_id"%value,"value":0}]
			ce=RestApiLogin.r.patch(url=dataconfig.interface_url,data=json.dumps(data1),verify=False)
			Lag.setDefaultInterface(value,0)
			c.execute("Update rulegroup set isdefault=0 where ingroupname='%s' and outgroupname='%s'"%(inname,outname))
			con.commit()
		con.close()
		return True
	else:
		con.close()
		return False


def action_to_rulegroup(inname,outname,rulegroup):
	num=0
	type_num=0
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select interlist from ingroup where name = '%s'"%inname)
	list1=json.loads(c.fetchone()[0])
	c.execute("select actid from action where name = '%s'"%outname)
	action_id=c.fetchone()[0]	
	for value in list1:
		c.execute("select ruleid,description from rule where name = '%s'"%rulegroup)
		res=c.fetchall()
		if res:
			for i in res:
				if i[1]!='drop':
					type_num=1
				else:
					pass
		else:
			pass
		if type_num==0:
			data1=[{"op":"replace","path":"/ingress_config/default_action_id","value":action_id}]
			RestApiLogin.r.patch(url=dataconfig.interface_url+"/"+value,data=json.dumps(data1),verify=False)
			Lag.setDefaultInterface(value,1)
			c.execute("Update rulegroup set isdefault=1 where name='%s'"%rulegroup)
			con.commit()
		else:
			pass
	c.execute("select ruleid from rule where name = '%s'"%rulegroup)
	res=c.fetchall()
	for i in res:
		if (action_to_rule(i[0],inname,outname,1,rulegroup)):
			pass
		else:
			num=1
	if num==0:
		return True
	else:
		return False



def action_to_rule(ruleid,inname='',outname='',ifgroup=0,rulegroup=0):
	num=1
	isdefault=0
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	if rulegroup!=0:
		c.execute("select isdefault from rulegroup where name='%s'"%rulegroup)
		isdefault=c.fetchone()
		if isdefault:
			if isdefault[0]==1:
				isdefault=1
			else:
				pass
		else:
			pass
	else:
		pass
	if inname=='':
		c.execute("select name from rule where ruleid = %d"%ruleid)
		db_rulegroupname=c.fetchone()
		c.execute("select ingroupname,outgroupname from rulegroup where name = '%s'"%db_rulegroupname[0])
		db_groupname=c.fetchone()
		inname=db_groupname[0]
		outname=db_groupname[1]
	else:
		pass
	c.execute("select interlist from ingroup where name = '%s'"%inname)
	result_in=c.fetchone()
	c.execute("select actid from action where name = '%s'"%outname)
	result_out=c.fetchone()
	if result_in and result_out:
		action_id=result_out[0]
		c.execute("select description from rule where ruleid = %d"%ruleid)
		drop_str=c.fetchone()
		if drop_str[0] == 'drop':
			action_id = result_out[0]+1
		else:
			pass
		list1=json.loads(result_in[0])
		key_default=0
		for value in list1:
			data1=[]
			ce=json.loads(RestApiLogin.r.get(url=dataconfig.interface_url+"/"+value,verify=False).text)
			data_rule_to_action=ce[value]["ingress_config"]["rule_to_action"]
			if data_rule_to_action!={}:
				data_rule_to_action[str(ruleid)]=action_id
			else:
				data_rule_to_action={str(ruleid):action_id}
			if ce[value]["ingress_config"]["default_action_id"]==action_id and isdefault==1:
				data1=[{"op":"replace","path":"/ingress_config/default_action_id","value":0}]
				Lag.setDefaultInterface(value,0)
				key_default=1
			data1.append({"op":"replace","path":"/ingress_config/rule_to_action","value":data_rule_to_action})
			data=json.dumps(data1)
			cd=RestApiLogin.r.patch(url=dataconfig.interface_url+"/"+value,data=data,verify=False)
			if cd.status_code==204:
				pass
			else:
				num=0
	if num==1:
		if key_default==1:
			c.execute("Update rulegroup set isdefault=0 where name='%s'"%rulegroup)
			con.commit()
		else:
			pass
		return True
	else:
		return False
def remove_action_to_rulegroup(inname,outname,rulegroup):
	num=0
	isdefault=0
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select isdefault from rulegroup where name='%s'"%rulegroup)
	isdefault=c.fetchone()
	if isdefault:
		if isdefault[0]==1:
			isdefault=1
	c.execute("select ruleid from rule where name = '%s'"%rulegroup)
	res=c.fetchall()
	if res==[] and isdefault==1:
		remove_default_action(inname,outname)
	for i in res:
		if (remove_action_to_rule(inname,outname,i[0],1)):#print('ok')
			pass
		else:
			num=1
	if num==0:
		return True
	else:
		con.close()
		return False

def remove_action_to_rule(inname,outname,ruleid,ifgroup=None):
	if ifgroup==None:
		ifgroup=0
	else:
		pass
	num=1
	isdefault=0
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select isdefault from rulegroup where ingroupname='%s' and outgroupname='%s'"%(inname,outname))
	isdefault=c.fetchone()
	if isdefault:
		if isdefault[0]==1:
			isdefault=1
	c.execute("select interlist from ingroup where name = '%s'"%inname)
	result_in=c.fetchone()
	c.execute("select actid from action where name = '%s'"%outname)
	result_out=c.fetchone()
	if result_out:
		action_id=result_out[0]
	c.execute("select description from rule where ruleid = %d"%ruleid)
	drop_str=c.fetchone()
	if result_in and result_out:
		if drop_str:
			if drop_str[0] == 'drop':
				action_id = result_out[0]+1
			else:
				pass
		else:
			pass
		list1=json.loads(result_in[0])
		for value1 in list1:
			data1=[]
			ce_delete=RestApiLogin.r.get(url=dataconfig.interface_url+"/"+value1,verify=False)
			if ce_delete.status_code==200:
				data_rule_to_action=json.loads(ce_delete.text)[value1]['ingress_config']["rule_to_action"]
				try:
					data_rule_to_action[str(ruleid)]=0
				except:
					return False
			else:
				return False
			data1.append({"op":"replace","path":"/ingress_config/rule_to_action","value":data_rule_to_action})
			data=json.dumps(data1)
			if (action_id%2!=1):
				action_id_now=action_id-1
			else:
				action_id_now=action_id
			cd=RestApiLogin.r.patch(url=dataconfig.interface_url+"/"+value1,data=data,verify=False)
			if cd.status_code==204:
				key_has=0
				ce=RestApiLogin.r.get(url=dataconfig.interface_url+"/"+value1,verify=False).text
				interfaces=json.loads(ce)
				for key,value in interfaces[value1]["ingress_config"]["rule_to_action"].items():
					if value==action_id_now:
						key_has=1
					else:
						pass
				if (key_has==0 and ifgroup==0):
					if interfaces[value1]["ingress_config"]["default_action_id"]!=0:
						pass#print("interfaces %s's default_action is resetting"%value1)
					else:
						pass
					default_action(inname,outname)
				elif ifgroup==1:
					if interfaces[value1]["ingress_config"]["default_action_id"]==action_id_now and isdefault==1:
						remove_default_action(inname,outname)
					else:
						pass
				else:
					pass
			else:
				num=0
	else:
		pass
	if num==1:
		return True
	else:
		return False	
	