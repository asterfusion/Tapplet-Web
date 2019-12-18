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
		
	@run_on_executor
	def login_byusername(self,username,password):    	#账号密码登录
		password=data_usr.PasswordProtect(password)
		ret =None
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where username='%s'"%username+" and password='%s'"%password)
		db_result = c.fetchone()
		if db_result:
			username=db_result[0]
			password=db_result[1]
			name=db_result[2]
			email=db_result[3]
			department=db_result[4]
			phone_num=db_result[5]
			description=db_result[6]
			rolename=db_result[7]
		con.close()
		ret = data_usr(username,name,email,department,phone_num,description,rolename)
		return ret
		
	"""def by_email(email,password):			#邮箱密码登录
		ret =None
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select username,password,name,email,department,phone_num,description,rolename from usr where email='%s'"%email+" and password='%s'"%password)
		db_result = c.fetchone()
		con.close()
		if db_result:
			username=db_result[0]
			password=db_result[1]
			name=db_result[2]
			email=db_result[3]
			department=db_result[4]
			phone_num=db_result[5]
			description=db_result[6]
			rolename=db_result[7]
		con.close()
		ret = data_usr(username,password,name,email,department,phone_num,description,rolename)
		return ret	
	"""
		
	@run_on_executor	
	def UserInsert(self,Data_user):
		password=data_usr.PasswordProtect(Data_user.password)
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		try:
			c.execute("Select count(*) from usr")
			num=c.fetchone()[0]
			if num>=50:
				raise RuntimeError('testError')
			c.execute("INSERT INTO usr (username,password,name,email,department,phone_num,description,rolename)\
			VALUES('%s','%s','%s','%s','%s','%s','%s','%s')"%(Data_user.username,password,Data_user.name,Data_user.email,Data_user.department,Data_user.phone_num,Data_user.description,Data_user.rolename))
			con.commit()
			con.close()
			return True
		except:
			con.close()
			return False
	
	@run_on_executor
	def UserUpdate(self,Data_user):                      ##更改用户信息
		if (Data_user.password==''):
			key=1
		else:
			key=0
		password=data_usr.PasswordProtect(Data_user.password)
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select username from usr where username='%s'"%Data_user.username)
		db_result1=c.fetchone()
		c.execute("select rolename from permission where rolename='%s'"%Data_user.rolename)
		db_result2=c.fetchone()
		if db_result1:
			if db_result2:
				if (key ==0):
					c.execute("UPDATE usr set password='%s',name='%s',email='%s',department='%s',phone_num='%s',description='%s',rolename='%s' where username='%s'"%(password,Data_user.name,Data_user.email,Data_user.department,Data_user.phone_num,Data_user.description,Data_user.rolename,Data_user.username))
				elif(key==1):
					c.execute("UPDATE usr set name='%s',email='%s',department='%s',phone_num='%s',description='%s',rolename='%s' where username='%s'"%(Data_user.name,Data_user.email,Data_user.department,Data_user.phone_num,Data_user.description,Data_user.rolename,Data_user.username))
				con.commit()
				con.close()
				return True
			else:
				con.close()
				return False
		else:
			con.close()
			return False
	
	
	@run_on_executor
	def UserDelete(self,username):
		con = sqlite3.connect(database_default.User_Permiss_db)
		c=con.cursor()
		c.execute("select username from usr where username='%s'"%username)
		db_result=c.fetchone()
		if db_result:
			c.execute("Delete from usr where username='%s'"%username)
			con.commit()
			con.close()
			return True
		else:
			con.close()
			return False	
	
	@run_on_executor
	def UserSelect(self,username='',name='',department=''):
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
		
	def PasswordProtect(password):
		obj = hashlib.md5()
		obj.update(bytes(password, encoding='utf-8'))
		protect_password = obj.hexdigest() 
		return protect_password      
			


#######################
#print(data_usr.UserSelect(0,'tan',0))
#######################	
			
