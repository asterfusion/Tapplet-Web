#!/usr/bin/python3
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import json
import logging
import sys
sys.path.append('./web/control/')
sys.path.append('./web/service/')
import User
import PermissHandler 
import session 
import permiss				
import data_operation
import Logconfig
import BaseHandler
from Logconfig import Web_log


class LoginHandler(RequestHandler):
	executor = ThreadPoolExecutor(20)
	def _request_summary(self):
			return 0
	@tornado.gen.coroutine
	def get(self,*args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		try:
			cookie_str=data_operation.ByteToStr(self.get_secure_cookie("str"))
			if cookie_str :
				str1=yield session.Session.DitGet(self,cookie_str)
				if (str1):
					ret1=yield User.data_usr.UserSelect(self,str1)
					ret1["status_code"]=200
					ret2=json.dumps(ret1)
					self.write(ret2)
				else:
					self.set_status(200,'wrong cookie')
					self.write(json.dumps({"status_code":400,"res":"cookie is wrong"}))
		except:
			self.set_status(200,'wrong cookie')
			self.write(json.dumps({"status_code":400,"res":"cookie is wrong"}))
		
	@tornado.gen.coroutine		
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		try:
			username = data['username']
			len15=len(username)
			if len15>15:
				raise RuntimeError('testError')
			password = data['password']
			log_data =json.dumps({"username":username,"password":password})
			ret1= yield User.data_usr.login_byusername(self,username,password)
			#print(ret1)
			Dictret=ret1.__dict__
			data1=yield permiss.permiss_data.PermissSelect(self,Dictret["rolename"])
			Dictret["permiss"]=json.loads(data1)
			self.set_status(200,'OK')
			self.write(json.dumps({"status_code":200,"data":Dictret}))
			yield session.Session.DitCheck(self,username)
			str1= yield session.Session.DitInsert(self,username)
			self.set_secure_cookie('str',str1)
			#print(session.NameDit)
			yield  Logconfig.Write_Sys_Log(self,username,'用户登录','用户登录',ip_address,log_data,200)
			Web_log.info('User %s was login by %s.'%(username,str1))
			#self.redirect("/nw/index.html#/users/welcome")
		except :
			yield Logconfig.Write_Sys_Log(self,username,'用户登录','登录错误',ip_address,json.dumps(data),4012)
			self.set_status(200,'用户名或密码错误')
			self.write(json.dumps({"status_code":4012}))
		
class ListHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('user_read')
		except :
			self.set_status(400,'')
	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		try :
			info_value=yield User.data_usr.UserSelect(self)
			ret1=json.dumps(info_value)
			Web_log.info('User %s was looking about UserList.'%self.username)
			self.write(ret1)
		except :
			self.set_status(400,'查找项出错')
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
														   	
class InsertHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('user_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		self.set_header("Content-Type","application/json")
		ip_address=self.request.remote_ip
		#print(self.request.body)
		data=data_operation.ByteToJson(self.request.body)
		username = data["username"]
		password = data["password"]	
		name = data["name"]
		email = data["email"]
		department=data["department"]
		phone_num=data["phone_num"]
		try:
			description=data["description"]
		except:
			description=''
		rolename=data["rolename"]
		if (username==''or password==''or name==''or email==''or department==''or phone_num==''or rolename==''):
			self.set_status(400,'参数不全或格式错误')
			self.write(json.dumps({"status_code":400,"res":"data wrong"}))
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加用户',ip_address,json.dumps(data)+"\ndata wrong",400)
			return False
		user_data=User.data_usr(username,name,email,department,phone_num,description,rolename,password)
		if(yield User.data_usr.UserInsert(self,user_data)):
			self.set_status(201,'创建成功')
			self.write(json.dumps({"status_code":200,"res":"Insert OK"}))
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加用户',ip_address,json.dumps(data),200)
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加用户',ip_address,json.dumps(data)+"\nusername exsit",422)
			self.set_status(422,'创建不成功,username已存在')
			self.write(json.dumps({"status_code":422,"res":"create is wrong"}))
			

class UpdateHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)
	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('user_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		self.set_header("Content-Type","application/json")
		ip_address=self.request.remote_ip
		data=data_operation.ByteToJson(self.request.body)
		try:	
			username = data["username"]
			try:
				password=data["password"]
			except:
				password=''
			name = data["name"]
			email = data["email"]
			department=data["department"]
			phone_num=data["phone_num"]
			try:
				description=data["description"]
			except:
				description=''
			rolename=data["rolename"]
			#print(password)
			if (username==''or name==''or email==''or department==''or phone_num==''or rolename==''):
				raise RuntimeError('testError')
			user_data=User.data_usr(username,name,email,department,phone_num,description,rolename,password)
			if(yield User.data_usr.UserUpdate(self,user_data)):
				self.set_status(201,"修改成功")
				self.write(json.dumps("Update OK"))
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','修改用户',ip_address,json.dumps(data),200)
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','修改用户',ip_address,json.dumps(data)+'\nusername is wrong',400)
				self.write(json.dumps({"status_code":422,"res":"username is wrong"}))
		except :
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','修改用户',ip_address,json.dumps(data)+'\n data wrong',400)
			self.set_status(400,"参数不全或格式错误")
			self.write(json.dumps("data wrong"))	

class DeleteHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('user_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		data=data_operation.ByteToJson(self.request.body)
		self.set_header("Content-Type","application/json")
		try:
			username = data["username"]
			if (username==''):
				raise RuntimeError('testError')	
			elif(yield User.data_usr.UserDelete(self,username)):
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','删除用户',ip_address,json.dumps(data),200)
				self.write(json.dumps("OK"))
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','删除用户',ip_address,json.dumps(data),400)
				self.set_status(400,"参数错误")
				self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
		except :
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','删除用户',ip_address,json.dumps(data),400)
			self.set_status(400,"参数不全或格式错误")
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))


class LogoutHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		try:
			cookie_str=data_operation.ByteToStr(self.get_secure_cookie("str"))
			res_delete=yield session.Session.DitDelete_exe(self,cookie_str)
			if res_delete==1:
				yield Logconfig.Write_Sys_Log(self,self.username,'用户登录','用户退出',ip_address,' ',200)
				self.write(json.dumps("OK"))
			else:
				raise RuntimeError('testError')
		except :
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','删除用户',ip_address,' ',400)
			self.set_status(400,"参数不全或格式错误")
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
			

if __name__ == "__main__":
	app = Application(
		[
			(r"/api/UserLogin", LoginHandler),
			(r"/api/UserList",ListHandler),
			(r"/api/UserInsert",InsertHandler),
			(r"/api/UserUpdate",UpdateHandler),
			(r"/api/UserDelete",DeleteHandler),
			(r"/api/RoleInsert", PermissHandler.InsertHandler),
			(r"/api/PermissDelete",PermissHandler.DeleteHandler),
			(r"/api/PermissList",PermissHandler.ListPHandler),
			(r"/api/RoleList",PermissHandler.ListRHandler),
			(r"/api/PermissUpdate",PermissHandler.UpdatePHandler),
			(r"/api/PermissTable",PermissHandler.GetTableHandler)
			
			
 ],cookie_secret="12334")

	app.listen(8001)
	debug = True

	IOLoop.current().start()

