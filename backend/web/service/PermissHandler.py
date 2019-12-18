#!/usr/bin/python3
import json
import logging
import sys
from concurrent.futures import ThreadPoolExecutor

import tornado.autoreload
from tornado.concurrent import run_on_executor
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler, url

import data_operation
import permiss
import session
import User
import Logconfig
import BaseHandler
from Logconfig import Web_log

sys.path.append('./web/control/')
class InsertHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine					##添加角色以及权限
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		data['permissions']=permiss.permiss_decode(data['permissions'])
		data1=yield permiss.permiss_data.PermissInsert(self,data['permissions'])
		#print(data)
		rolename = data['rolename']
		try:
			description=data['description']
		except:
			description=''
		try :
			if(yield permiss.permiss_data.RoleInsert(self,rolename,data1,description)):
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加角色',ip_address,json.dumps(data),200)
				self.write(json.dumps({"status_code":200,"res":"ok"}))				
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加角色',ip_address,json.dumps(data)+'\nrolename is exsited',400)
				self.write(json.dumps({"status_code":400,"res":"rolename is exsited"}))
		except :
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','添加角色',ip_address,json.dumps(data),401)
			self.set_status(401,'no')
			self.write(json.dumps({"status_code":401}))
			


class ListPHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine						##列出角色对应权限（每次修改需要添加）
	def get(self): 
		self.set_header("Content-Type","application/json")
		rolename = (self.get_arguments('rolename'))
		try :
			ret1=yield permiss.permiss_data.PermissSelect(self,rolename[0])
			data=json.loads(ret1)
			data1=permiss.permiss_encode(data)
			self.write(json.dumps({"status_code":200,"message":"success","data":data1}))
			Web_log.info("User %s was looking about %s 's permission list"%(self.username,rolename))
		except :
			self.set_status(400,'查找项出错')
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
			
class ListRHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine							##列出用户对应角色
	def get(self):
		self.set_header("Content-Type","application/json")
		Web_log.info("User %s was looking about rolelist:"%self.username)	      		
		ret1=yield permiss.permiss_data.RoleSelect(self)
		data=json.dumps(ret1)
		self.write(data)
	
		
class UpdatePHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine							#更新角色对应权限（每次修改需要添加）
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		try:
			data=data_operation.ByteToJson(self.request.body)
			data_permission=permiss.permiss_decode(data['permissions'])
			data1=yield permiss.permiss_data.PermissInsert(self,data_permission)
			Web_log.info("User %s was updating %s 's permission:"%(self.username,data["rolename"]))	
			yield permiss.permiss_data.PermissUpdate(self,data["rolename"],data1,data["description"])
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','更新角色',ip_address,json.dumps(data),200)		
			self.set_status(200,'ok')
			self.write(json.dumps('OK'))
		except:
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','更新角色',ip_address,json.dumps(data)+"\ndata is wrong",400)		
			self.set_status(400,'data wrong')
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
class DeleteHandler(BaseHandler.BaseHandler):	
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine					#更新角色对应权限
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		rolename = data["rolename"]
		if(yield permiss.permiss_data.RoleDelete(self,rolename)):
			Web_log.info("User %s was deleting role:%s"%(self.username,data["rolename"]))	
			yield Logconfig.Write_Sys_Log(self,self.username,'用户管理','删除角色',ip_address,json.dumps(data),200)	
			self.set_status(201,'ok')
			self.write(json.dumps('OK'))
		else:
			self.set_status(400,'data wrong')
			self.write(json.dumps({"status_code":400,"res":"data is wrong"}))
			
class GetTableHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine									##每次修改权限需要添加
	def get(self):
		ret1=yield permiss.permiss_data.PermissTable(self)
		data=json.loads(ret1)
		data1=permiss.permiss_encode(data)
		self.write(json.dumps({"status_code":200,"message":"success","data":data1}))
		
class GetPermissHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine	
	def get(self):
		self.set_header("Content-Type","application/json")
		try:
			value_1=yield User.data_usr.UserSelect(self,self.username)
			value2=value_1['data'][0]["rolename"]
			value1=yield permiss.permiss_data.PermissSelect(self,value2)
			value1=permiss.permiss_encode(json.loads(value1))
			self.write(json.dumps({"status_code":200,"message":"success","data":{"permiss":value1,"rolename":value2}}))
		except:
			self.write(json.dumps({"status_code":400}))
			self.set_status(400,"")

if __name__ == "__main__":
    app = Application(
    	[
    		(r"/api/RoleInsert",InsertHandler),
    		(r"/api/PermissList/",ListPHandler),
    		(r"/api/RoleList",ListRHandler),
    		(r"/api/PermissUpdate",UpdatePHandler),
    		(r"/api/RoleDelete",DeleteHandler),
    		(r"/api/PermissTable",GetTableHandler)
    		
    		
    		
 ],cookie_secret="12334")

    app.listen(8001)

    IOLoop.current().start()
