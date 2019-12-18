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
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
from Logconfig import Web_log
import Rule
import database_default
import data_operation
import RestApiLogin
import dataconfig
urllib3.disable_warnings()

@run_on_executor
def outlist_write(self,data1):                              #出接口组创建
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	if "description" not in data1:
		data1["description"]=''
	else:
		pass
	if(action_insert(data1)):
		try:
			c.execute("INSERT INTO outgroup (name,description,interlist) VALUES('%s','%s','%s')"%(data1["name"],data1["description"],json.dumps(data1["interlist"])))
		except:
			con.close()
			action_delete(data1["name"])
			return False
		con.commit()
		con.close()
		return True
	else:
		con.close()
		return False

##########################################################################################
@run_on_executor
def outlist_delete(self,name):                					#出接口组删除
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select * from outgroup where name ='%s'"%name)
	db_result = c.fetchone()
	if db_result:
		try:
			c.execute("Delete from outgroup where name='%s'"%name)
			con.commit()
			Rule.rulegroup_delete("","",name)
			action_delete(name)
			con.commit()
			con.close()
			return True
		except:	
			return False
	else:
		return False

##########################################################################################
	
def list_insert():							#计数初始化
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	list1=list(range(1,1001))
	jsonlist=json.dumps(list1)
	c.execute("UPDATE outgroup set description='%s' where lagid=1001"%jsonlist)
	con.commit()
	con.close()
	return True

##########################################################################################
@run_on_executor
def outlist_select(self):							#出接口查询
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	list1=[]
	c.execute("select name,description,interlist from outgroup ")
	db_result = c.fetchall()
	if db_result:
		for row in db_result:
			name=row[0]
			description=row[1]
			interlist=row[2]
			data_act=action_select(name)
			if(data_act):
				data_act["interlist"]=json.loads(interlist)
				data_act["name"]=name
				data_act["description"]=description
				list1.append(data_act)
			else :
				c.execute("Delete from outgroup where name='%s'"%name)
				con.commit()
				action_delete(name)
				Rule.rulegroup_delete("","",name)
				continue
	con.close()
	return list1	
	

##########################################################################################

def outlist_update(data1):
	con = sqlite3.connect(database_default.lag_db)	
	c=con.cursor()
	c.execute("select * from outgroup where name ='%s'"%data1["name"])
	db_result = c.fetchone()
	if db_result:
		if(action_put(data1)):
			c.execute("UPDATE outgroup set description='%s',interlist='%s' where name ='%s'"%(data1["description"],json.dumps(data1["interlist"]),data1["name"]))
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False
	else:
		con.close()
		return False
		
##########################################################################################

def outlist_put(data1):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select * from outgroup where name ='%s'"%data1["name"])
	db_result = c.fetchone()
	if db_result:
		if(action_put(data1)):
			c.execute("UPDATE outgroup set description='%s',interlist='%s' where name ='%s'"%(data1["description"],json.dumps(data1["interlist"]),data1["name"]))
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False
	else:
		con.close()
		return False

##########################################################################################		
@run_on_executor
def inlist_write(self,data1):	#入接口创建
	con = sqlite3.connect(database_default.lag_db)
	interlist=json.dumps(data1["interlist"])
	if "description" not in data1:
		data1["description"]=''
	else:
		pass
	c=con.cursor()
	try:
		c.execute("INSERT INTO ingroup (name,interlist,description) VALUES('%s','%s','%s')"%(data1["name"],interlist,data1["description"]))
		con.commit()
		con.close()
	except:
		return False
	return True


##########################################################################################

@run_on_executor		
def inlist_delete(self,name):							#入接口删除
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select name from ingroup where name ='%s'"%name)
	db_result = c.fetchone()
	if db_result:
		c.execute("Delete from ingroup where name='%s'"%name)
		con.commit()
		con.close()
		return True
	else:
		return False
		
		
##########################################################################################

@run_on_executor		
def inlist_select(self):							#入接口查询
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	list1=[]
	c.execute("select name,interlist,description from ingroup")
	db_result = c.fetchall()
	if db_result:
		while (1):
			for row in db_result:
				name=row[0]
				interlist=row[1]
				description=row[2]
				list1.append({"name":name,"interlist":json.loads(interlist),"description":description})
			else :
				break
	return list1	
	
##########################################################################################	
@run_on_executor	
def inlist_update(self,data1):
	con = sqlite3.connect(database_default.lag_db)
	interlist=json.dumps(data1["interlist"])
	if "description" not in data1:
		data1["description"]=''
	else:
		pass
	c=con.cursor()
	try:
		c.execute("UPDATE ingroup set interlist='%s',description='%s' where name='%s'"%(interlist,data1["description"],data1["name"]))
		con.commit()
		con.close()
		return True
	except:
		return False	
	
#########################################################################################
def action_insert(config):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select basisconfig,additionalconfig from action where name = 'None'")
	db_result=c.fetchone()
	list1=json.loads(db_result[1])
	if (len(list1)==0):
		actid=int(db_result[0])
		c.execute("UPDATE action set basisconfig='%s' where name='None'"%str(actid+2))   ##修改
	else:
		actid=list1[0]
		del list1[0]
		jsonlist=json.dumps(list1)
		c.execute("UPDATE action set additionalconfig='%s' where name='None'"%jsonlist)
	basisconfig={"type":"load_balance","interfaces": config["interlist"],"load_balance_mode":config["loadbalance"]["mode"],"load_balance_weight":config["loadbalance"]["weight"]}
	if len(config["interlist"])==1:
		basisconfig["type"]="forward"
		basisconfig['load_balance_mode']=''
		basisconfig['load_balance_weight']=''
	else:
		basisconfig["type"]="load_balance"#改
	if ("additional_actions" in config):
		actiondata1=json.dumps({str(actid):{"basis_actions":basisconfig,"additional_actions":config["additional_actions"]}})
		actiondata2=json.dumps({str(actid+1):{"basis_actions":{"type":"drop"},"additional_actions":{}}})###后续修改
	else:
		pass
	c.execute("INSERT INTO action (name,actid,basisconfig,additionalconfig) VALUES('%s',%d,'%s','%s')"%(config["name"],actid,json.dumps(basisconfig),json.dumps(config["additional_actions"])))
	re1=RestApiLogin.r.post(url=dataconfig.action_url,data=actiondata1,verify=False)
	#print(actiondata1,re1)
	if re1.status_code==201:
		re2=RestApiLogin.r.post(url=dataconfig.action_url,data=actiondata2,verify=False)
	else:
		con.close()
		return False
	if (re1.status_code==re2.status_code and re1.status_code==201):
		con.commit()
		con.close()
		return True
	else:
		con.close()
		return False
#########################################################################################

def action_put(config):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select actid from action where name = '%s'"%config["name"])
	db_result=c.fetchone()
	actid=db_result[0]
	basisconfig={"type":"load_balance","interfaces": config["interlist"],"load_balance_mode":config["loadbalance"]["mode"],"load_balance_weight":config["loadbalance"]["weight"]}
	if len(config["interlist"])==1:
		basisconfig["type"]="forward"
		basisconfig['load_balance_mode']=''
		basisconfig['load_balance_weight']=''
	else:
		basisconfig["type"]="load_balance"#改
	c.execute("Update  action set actid=%d,basisconfig='%s',additionalconfig='%s' where name='%s'"%(actid,json.dumps(basisconfig),json.dumps(config["additional_actions"]),config["name"]))
	if ("additional_actions" in config):
		actiondata=json.dumps({str(actid):{"basis_actions":basisconfig,"additional_actions":config["additional_actions"]}})
	else:
		actiondata=json.dumps({str(actid):{"basis_actions":basisconfig}})
	re=RestApiLogin.r.put(url=dataconfig.action_url,data=actiondata,verify=False)
	if (re.status_code==200):
		con.commit()
		con.close()
		return True
	else:
		con.close()
		return False

#########################################################################################
def action_delete(name):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select basisconfig,additionalconfig from action where name = 'None'")
	db_result=c.fetchone()
	list1=json.loads(db_result[1])
	actid=int(db_result[0])
	c.execute("select actid from action where name='%s'"%name)
	db_result=c.fetchone()
	if (db_result):
		c.execute("Delete from action where name='%s'"%name)
		re1=RestApiLogin.r.delete(url=dataconfig.action_url+"/"+str(db_result[0]),verify=False)
		re2=RestApiLogin.r.delete(url=dataconfig.action_url+"/"+str(db_result[0]+1),verify=False)
		list1.insert(0,db_result[0])
		if (len(list1)==(actid-1)/2):
			list1=[]
			actid=1
		jsonlist=json.dumps(list1)
		c.execute("UPDATE action set basisconfig='%s',additionalconfig='%s' where name='None'"%(str(actid),jsonlist))
	else:
		con.close()
		return False
	con.commit()
	con.close()
	return True
	

def action_select(name):
	data_basis={}
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("select actid ,basisconfig,additionalconfig from action where name = '%s'"%name)
	db_result=c.fetchone()
	if (db_result):
		data_basis=json.loads(db_result[1])
		data_basis["interlist"]=data_basis["interfaces"]
		data_basis["loadbalance"]={"mode":data_basis["load_balance_mode"],"weight":data_basis["load_balance_weight"]}
		data_basis['additional_actions']=json.loads(db_result[2])
		del data_basis["load_balance_mode"]
		del data_basis["load_balance_weight"]
		del data_basis["interfaces"]
	return data_basis
	


def action_update(config):
	list1=[]
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	if config["loadbalance"]["mode"]=='':
		config["loadbalance"]["mode"]='outer_srcdstip'
	else:
		pass
	basisconfig={"type":"load_balance","interfaces": config["interlist"],"load_balance_mode":config["loadbalance"]["mode"],"load_balance_weight":config["loadbalance"]["weight"]}
	if len(config["interlist"])==1:
		basisconfig["type"]="forward"
		basisconfig['load_balance_mode']=''
		basisconfig['load_balance_weight']=''
	else:
		basisconfig["type"]="load_balance"#改
	c.execute("update action set basisconfig='%s',additionalconfig='%s' where name = '%s'"%(json.dumps(basisconfig),json.dumps(config["additional_actions"]),config["name"]))
	c.execute("select actid from action where name = '%s'"%config["name"])
	db_result=c.fetchone()
	if (db_result):
		data_patch=config["additional_actions"]
		data_1={"op":"replace","path":"/%s/additional_actions"%db_result[0],"value":data_patch}
		list1.append(data_1)
		if len(config["interlist"])>1:
			data_basis={"interfaces":config["interlist"],"type":"load_balance","load_balance_mode":config["loadbalance"]["mode"],"load_balance_weight":config["loadbalance"]["weight"]}
			data_1={"op":"replace","path":"/%s/basis_actions"%db_result[0],"value":data_basis}
			list1.append(data_1)
		else:
			data_basis={"interfaces":config["interlist"],"type":"forward","load_balance_mode":"","load_balance_weight":""}
			data_1={"op":"replace","path":"/%s/basis_actions"%db_result[0],"value":data_basis}
			list1.append(data_1)
		re=RestApiLogin.r.patch(url=dataconfig.action_url,data=json.dumps(list1),verify=False)
		if (re.status_code==204):
			con.commit()
			con.close()
			return True
		else:
			return False


def interlist_update(type1,groupname,port):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	if type1 == "Igress":
		c.execute("select interlist from ingroup where name ='%s'"%groupname)
		res=c.fetchone()
		if res:
			interlist=json.loads(res[0])
			if port not in interlist:
				interlist.append(port)
			else:
				con.close()
				return False
			c.execute("UPDATE ingroup set interlist='%s' where name='%s'"%(json.dumps(interlist),groupname))
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False
	elif type1 == "Egress":
		c.execute("select interlist from outgroup where name ='%s'"%groupname)
		res=c.fetchone()
		c.execute("select actid,basisconfig from action where name = '%s'"%groupname)
		res1=c.fetchone()
		if res:
			interlist=json.loads(res[0])
			if port not in interlist:
				interlist.append(port)
			else:
				con.close()
				return False
			if res1:
				actid=res1[0]
				basisconfig = json.loads(res1[1])
				basisconfig["interfaces"]=interlist
				if len(interlist)==2:
					basisconfig["type"]="load_balance"
					if basisconfig["load_balance_mode"]=='':
						basisconfig["load_balance_mode"]="outer_src_dst_ip"
					else:
						pass
					c.execute("UPDATE action set basisconfig='%s' where name = '%s'"%(json.dumps(basisconfig),groupname))
					con.commit()
				data_1=[{"op":"replace","path":"/%s/basis_actions"%str(actid),"value":basisconfig}]#修改
				re=RestApiLogin.r.patch(url=dataconfig.action_url,data=json.dumps(data_1),verify=False)
				if (re.status_code==204):
					c.execute("UPDATE outgroup set interlist='%s' where  name ='%s'"%(json.dumps(interlist),groupname))
					con.commit()
					con.close()
					return True
				else:
					con.close()
					return False
			else:
				con.close()
				return False
	else:
		return False
			


def interlist_delete(type1,groupname,port):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	if type1 == "Igress":
		c.execute("select interlist from ingroup where name ='%s'"%groupname)
		res=c.fetchone()
		if res:
			interlist=json.loads(res[0])
			if port in interlist:
				interlist.remove(port)
			else:
				con.close()
				return False
			c.execute("UPDATE ingroup set interlist='%s' where name='%s'"%(json.dumps(interlist),groupname))
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False
	elif type1 == "Egress":
		c.execute("select interlist from outgroup where name ='%s'"%groupname)
		res=c.fetchone()
		c.execute("select actid,basisconfig from action where name = '%s'"%groupname)
		res1=c.fetchone()
		if res and res1:
			actid=res1[0]
			basisconfig = json.loads(res1[1])
			interlist=json.loads(res[0])
			if port in interlist:
				interlist.remove(port)
			else:
				con.close()
				return False
			basisconfig["interfaces"]=interlist
			if len(interlist)==1:
				basisconfig["type"]="forward"
				basisconfig["load_balance_mode"]=''
				basisconfig["load_balance_weight"]=''
			data_1=[{"op":"replace","path":"/%s/basis_actions"%str(actid),"value":basisconfig}]#修改
			re=RestApiLogin.r.patch(url=dataconfig.action_url,data=json.dumps(data_1),verify=False)
			if (re.status_code==204):
				c.execute("UPDATE action set basisconfig='%s' where name = '%s'"%(json.dumps(basisconfig),groupname))
				c.execute("UPDATE outgroup set interlist='%s' where name='%s'"%(json.dumps(interlist),groupname))
				con.commit()
				con.close()
				return True
			else:
				con.close()
				return False
		else:
			con.close()
			return False

def setDefaultInterface(id1,value1):
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("Update default_interface set value = %d where id='%s'"%(value1,id1))
	con.commit()
	con.close()

def getDefaultInterface():
	data_dict={}
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("Select * from default_interface")
	res=c.fetchall()
	if res:
		for i in res:
			if int(i[1])==1:
				value1=True
				data_dict[i[0]]=value1
			else:
				pass
	con.close()
	return data_dict
#list1=["X1","X2","X3"]
#inlist_write('test2',list1,"ok","OK")
#inlist_delete('test2')
#print(inlist_select())
#list1=["X1","X2","X3"]
#outlist_write('test2',list1,"OK")
#inlist_delete('test2')
#print(outlist_select())
#######################
#print(data_usr.UserSelect(0,'tan',0))
#######################	
#action_insert('test2','i dont know,too','so do i!!')
#action_delete('test2')
"""
config={
	"name":"test2",
    "lagid":1,
    "description":"ok",
    "interfaces": ["X1","X2"],
    "load_balance_mode": "wrr",
    "load_balance_weight": "2:1",	     
    "additional_actions": {
		"time_stamping": {
		"switch":1
		},
	"gre_encapsulation":{
		"switch":1,
		"gre_dmac" : "11:22:33:44:55:66",
		"gre_dip" : "192.168.1.100"
		},
	"slice":{
		"switch":1,
		"slice_bytes": 100,
		"slice_flag_update": 1
		},
	"remove_tunnel_header_vlan": {
		"switch":1,
		"vlan_layers": [1,2]
		} 
	} 
}
{"1":{
	"basis_actions":{
		"type":"load_balance"
		"interfaces": ["X1","X2"],
		"load_balance_mode": "wrr",
		"load_balance_weight": "2:1"
		}	     
    "additional_actions": {
		"time_stamping": {
		"switch":1
		},
	"gre_encapsulation":{
		"switch":1,
		"gre_dmac" : "11:22:33:44:55:66",
		"gre_dip" : "192.168.1.100"
		},
	"slice":{
		"switch":1,
		"slice_bytes": 100,
		"slice_flag_update": 1
		},
	"remove_tunnel_header_vlan": {
		"switch":1,
		"vlan_layers": [1,2]
		}}}}	
action_insert(config)



{'type': 'load_balance',
 'interlist': ['X1', 'X2', 'X3', 'X4'], 
 'loadbalance': {'mode': 'wrr', 'weight': '1:1:1:1'}, 
 "additional_actions": {
            "gre_encapsulation": {
                "switch": 1,
                "gre_dmac": "ff:ff:ff:ff:11:27",
                "gre_dip": "192.168.1.225"
            },
            "remove_tunnel_header_gre": {
                "switch": 1,
                "flag_remove_tunnel_header_gre_update_crc": 1
            },
            "remove_tunnel_header_vlan": {
                "switch": 1,
                "vlan_layers": [1]
            },
            "remove_tunnel_header_mpls": {
                "switch": 1,
                "mpls_layers": [1]
            },
            "remove_tunnel_header_vxlan": {
                "switch": 1,
                "vxlan_layers": [1]
            },
            "slice": {
                "switch": 0,
                "slice_bytes": 0,
                "slice_flag_update": 0
            },
            "time_stamping": {
                "switch": 0
            }
 'name': 'aaa', 
 'description': 'aa'
 }

{
    "X1": {
        "deduplication_enable": 0,
        "ingress_config": {
            "default_action_id": 0,
            "rule_group": "1",
            "rule_to_action": {},
            "tuple_mode": 0
        }
    }
}
"""