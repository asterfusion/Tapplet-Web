#!/usr/bin/python3
import sqlite3
import json
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
import User
import permiss_static
import permiss
import database_default


Open_permiss=0  #quanxian kaiqi

class permiss_data:
	executor = ThreadPoolExecutor(20)
	'''
	存储角色权限
	'''
	def __init__(self,user_read='0',user_write='0',role_read='0',role_write='0',policy_read='0',policy_write='0',time_read='0',time_write='0',configwrite_read='0',configwrite_write='0',configreset_read='0',configreset_write='0',hostname_read='0',hostname_write='0',setting_read='0',setting_write='0',log_read='0',log_write='0',waringlog_read='0',waringlog_write='0'): 				#顺序不能改 在后面添加删除
		self.user_read=user_read
		self.user_write=user_write
		self.role_read=role_read
		self.role_write=role_write
		self.policy_read=policy_read
		self.policy_write=policy_write
		self.time_read=time_read
		self.time_write=time_write
		self.configwrite_read=configwrite_read
		self.configwrite_write=configwrite_write
		self.configreset_read=configreset_read
		self.configreset_write=configreset_write
		self.hostname_read=hostname_read
		self.hostname_write=hostname_write
		self.setting_read=setting_read
		self.setting_write=setting_write
		self.log_read=log_read
		self.log_write=log_write
		self.waringlog_read=waringlog_read
		self.waringlog_write=waringlog_write
	#待补全
	@run_on_executor
	def RoleInsert(self,rolename,permission,description=''):					##角色添加
		con=sqlite3.connect(database_default.User_Permiss_db)	
		c=con.cursor()
		try:	
			c.execute("Select count(*) from permission")
			num=c.fetchone()[0]
			if num>=50:
				raise RuntimeError('testError')
			ret1=json.dumps(permission.__dict__)
			c.execute("INSERT INTO permission (rolename,permiss,description) VALUES('%s','%s','%s')"%(rolename,ret1,description))
			con.commit()
			con.close()
			return True
		except:
			con.close()
			return False
			
	@run_on_executor		
	def PermissUpdate(self,rolename,data,description):							#更改角色权限
		str1=data.__dict__
		Jstr1=json.dumps(str1)
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select rolename from permission where rolename='%s'"%rolename)
		db_result=c.fetchone()
		if db_result:
			c.execute("UPDATE permission set permiss='%s',description='%s' where rolename='%s'"%(Jstr1,description,rolename))
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False
	@run_on_executor
	def PermissSelect(self,rolename):								#权限查看
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select permiss from permission where rolename='%s'"%rolename)
		db_result = c.fetchone()
		return db_result[0]
	@run_on_executor	
	def RoleDelete(self,rolename):								#删除用户
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select permiss from permission where rolename='%s'"%rolename)
		db_result = c.fetchone()
		if db_result:
			c.execute("PRAGMA FOREIGN_KEYS=ON")
			try:
				c.execute("Delete from permission where rolename='%s'"%rolename)
				con.commit()
				con.close()
				return True
			except:
				con.close()
				return False
		else:
			con.close()
			return False
		
		
	@run_on_executor	
	def RoleSelect(self):								##取出所拥有的权限名、描述
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select rolename,description from permission where rolename not in ('test')")
		db_result = c.fetchall()
		list1=[]
		if db_result:
			while (1):
				for row in db_result:
					rolename=row[0]
					description=row[1]
					list1.append({'rolename':rolename,'description':description})
				else :
					break
		c.execute("Select count(*) from permission")
		num=c.fetchone()[0]
		num=num-1
		con.close()
		return {"data":list1,"count":num}	
		
	@run_on_executor	
	def PermissTable(self):									##取出空的权限表
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select permiss from permission where rolename='test'")
		db_result = c.fetchone()
		return db_result[0]
			
	@tornado.gen.coroutine
	@run_on_executor
	def PermissJudge(self,rolename,per1):			##输入角色名验证权限
		test=yield permiss.permiss_data.PermissSelect(self,rolename)
		try:
			test1=json.loads(test)
			result = test1[per1]
			return result
		except:
			return False

	@run_on_executor
	def PermissTest(self,username,per1):			##输入用户名验证权限
		try:
			if username:
				test=permiss_static.data_usr.UserSelect(username)
				key=permiss_static.permiss_data.PermissJudge(test["data"][0]["rolename"],per1)
				return int(key)
			else:
				return False
		except:
				return False
	@run_on_executor			
	def PermissInsert(self,permission):
		data1=permiss.permiss_data(permission["user_read"],permission["user_write"],
		permission["role_read"],permission["role_write"],
		permission["policy_read"],permission["policy_write"],
		permission["time_read"],permission["time_write"],
		permission["configwrite_read"],permission["configwrite_write"],
		permission["configreset_read"],permission["configreset_write"],
		permission["hostname_read"],permission["hostname_write"],
		permission["setting_read"],permission["setting_write"],
		permission["log_read"],permission["log_write"],
		permission["waringlog_read"],permission["waringlog_write"])
		return data1
			
	
class permiss_qianduan:
	def __init__(self,is_read,is_write):
		self.is_read=is_read
		self.is_write=is_write

def permiss_encode(data1):
	data=data1
	list1=[]
	list1.append(permiss_qianduan(data["user_read"],data["user_write"]).__dict__)
	list1.append(permiss_qianduan(data["role_read"],data["role_write"]).__dict__)
	list1.append(permiss_qianduan(data["policy_read"],data["policy_write"]).__dict__)
	list1.append(permiss_qianduan(data["time_read"],data["time_write"]).__dict__)
	list1.append(permiss_qianduan(data["configwrite_read"],data["configwrite_write"]).__dict__)
	list1.append(permiss_qianduan(data["configreset_read"],data["configreset_write"]).__dict__)
	list1.append(permiss_qianduan(data["hostname_read"],data["hostname_write"]).__dict__)
	list1.append(permiss_qianduan(data["setting_read"],data["setting_write"]).__dict__)
	list1.append(permiss_qianduan(data["log_read"],data["log_write"]).__dict__)
	list1.append(permiss_qianduan(data["waringlog_read"],data["waringlog_write"]).__dict__)
	data_permiss=[
		{
			"name":"usermanage",
			"items":{
				"user":list1[0],
				"role":list1[1]}
		},{
			"name":"policy",
			"items":{
				"policy":list1[2]}
		},{
			"name":"system",
			"items":{
				"time":list1[3],
				"configwrite":list1[4],
				"configreset":list1[5],
				"hostname":list1[6]}
		},{
			"name":"business",
			"items":{
				"setting":list1[7]
			}
		},{
			"name":"log",
			"items":{
				"log":list1[8],
				"waringlog":list1[9]
			}
		}
			]
	return data_permiss

def permiss_decode(data1):
	permiss_dict={
		"user_read":data1[0]["items"]["user"]["is_read"],
		"user_write":data1[0]["items"]["user"]["is_write"],
		"role_read":data1[0]["items"]["role"]["is_read"],
		"role_write":data1[0]["items"]["role"]["is_write"],
		"policy_read":data1[1]["items"]["policy"]["is_read"],
		"policy_write":data1[1]["items"]["policy"]["is_write"],
		"time_read":data1[2]["items"]["time"]["is_read"],
		"time_write":data1[2]["items"]["time"]["is_write"],
		"configwrite_read":data1[2]["items"]["configwrite"]["is_read"],
		"configwrite_write":data1[2]["items"]["configwrite"]["is_write"],
		"configreset_read":data1[2]["items"]["configreset"]["is_read"],
		"configreset_write":data1[2]["items"]["configreset"]["is_write"],
		"hostname_read":data1[2]["items"]["hostname"]["is_read"],
		"hostname_write":data1[2]["items"]["hostname"]["is_write"],
		"setting_read":data1[3]["items"]["setting"]["is_read"],
		"setting_write":data1[3]["items"]["setting"]["is_write"],
		"log_read":data1[4]["items"]["log"]["is_read"],
		"log_write":data1[4]["items"]["log"]["is_write"],
		"waringlog_read":data1[4]["items"]["waringlog"]["is_read"],
		"waringlog_write":data1[4]["items"]["waringlog"]["is_write"]
		}
	return permiss_dict

if __name__ == "__main__":
	Permiss_op.PermissJudge('admin','user_read')
	Permiss_op.PermissTest('tsl11','user_read')
