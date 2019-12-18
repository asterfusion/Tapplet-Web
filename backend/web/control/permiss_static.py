#!/usr/bin/python3
import sqlite3
import json
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
import permiss
import hashlib    
import database_default
import data_operation
class data_usr:
	'''
	存储用户数据
	'''
	def __init__ (self,username,name,email,department,phone_num,description,rolename,password=''):
		self.username=username
		self.password=password
		self.name=name
		self.department=department
		self.email=email
		self.phone_num=phone_num
		self.description=description
		self.rolename=rolename

	def UserSelect(username=False,name=False,department=False):
		sum=0
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		if username :
			sum=sum+1
		if department:
			sum=sum+2
		if name :
			sum=sum+4
		if (sum==0):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr")
		elif (sum==1):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where username='%s'"%username)
		elif (sum==2):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where department='%s'"%department)
		elif (sum==3):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where username='%s' and department='%s'"%(username,department))
		elif (sum==4):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where name='%s'"%name)
		elif (sum==5):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where username='%s' and name='%s'"%(username,name))
		elif (sum==6):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where department='%s' and name='%s'"%(department,name))
		elif (sum==7):
			c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where username='%s' and department='%s' and name='%s'"%(username,department,name))
		db_result = c.fetchall()
		list1=[]
		if db_result:
			while (1):
				for row in db_result:
					username=row[0]
					password=row[1]
					name=row[2]
					email=row[3]
					department=row[4]
					phone_num=row[5]
					description=row[6]
					rolename=row[7]
					list1.append((data_usr(username,name,email,department,phone_num,description,rolename).__dict__))
				else :
					break
		c.execute("Select count(*) from usr")
		num=c.fetchone()[0]
		con.close()
		return {"data":list1,"count":num}	
		
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
	
	def PermissJudge(rolename,per1):			##输入角色名验证权限
		test=permiss_data.PermissSelect(rolename)
		try:
			test1=json.loads(test)
			result = test1[per1]
			return result
		except:
			return False
	def PermissSelect(rolename):								#权限查看
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select permiss from permission where rolename='%s'"%rolename)
		db_result = c.fetchone()
		return db_result[0]
	def PermissTest(username,per1):			##输入用户名验证权限
		try:
			if username:
				test=data_usr.UserSelect(username)
				key=permiss_data.PermissJudge(test["data"][0]["rolename"],per1)
				return int(key)
			else:
				return False
		except:
				return False

#######################
#print(data_usr.UserSelect(0,'tan',0))
#######################	
			
