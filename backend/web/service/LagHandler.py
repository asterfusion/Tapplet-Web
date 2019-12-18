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
sys.path.append('./web/database/')
import interface_http
import User 
import permiss
import Lag 
import Rule
import session
import data_operation
import Logconfig
from Logconfig import Web_log
import BaseHandler

Open_permiss=0

class ListOutgroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Laglist=yield Lag.outlist_select(self)
		LagData=json.dumps(Laglist)
		self.write(LagData)

class ListIngroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Laglist=yield Lag.inlist_select(self)
		LagData=json.dumps(Laglist)
		self.write(LagData)
	

class InsertOutgroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=yield Lag.outlist_write(self,data)
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','创建出端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps({"status_code":200,"res":"OK"}))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','创建出端口组',ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"outgroupname is exsited"}))
			self.set_status(400,'existed')
			

class InsertIngroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=yield Lag.inlist_write(self,data)
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','创建入端口组',ip_address,json.dumps(data),200)
			self.set_status(200,'OK')
			self.write(json.dumps("inlist insert ok"))
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','创建入端口组',ip_address,json.dumps(data)+'\nname is exsited',400)
			self.write(json.dumps({"status_code":400,"res":"name is exsited"}))
			self.set_status(400,'existed')

class DeleteOutgroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		data=data["name"]
		res=yield Lag.outlist_delete(self,data)
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除出端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除出端口组',ip_address,json.dumps(data)+'\nnot exsited',400)
			self.write(json.dumps({"status_code":400,"res":"outgroupname is not exsited"}))
			self.set_status(400,'not existed')
			
class DeleteIngroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		data=data["name"]
		res=yield Lag.inlist_delete(self,data)
		if(res==True):
			res_rule=Rule.rulegroup_delete('',data)
			if res_rule==True:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除入端口组',ip_address,json.dumps(data),200)
				self.write(json.dumps('OK'))
				self.set_status(200,'ok')
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除入端口组',ip_address,json.dumps(data)+'\nrule is not exsited',400)
				self.write(json.dumps({"status_code":400,"res":"rule is not exsited"}))
				self.set_status(400,'not existed')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除入端口组',ip_address,json.dumps(data)+'\ningroupname is not exsited',400)
			self.write(json.dumps({"status_code":400,"res":"ingroupname is not exsited"}))
			self.set_status(400,'not existed')
			
			
class UpdateIngroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		data=data_operation.ByteToJson(self.request.body)
		self.set_header("Content-Type","application/json")
		if "deduplication_cfg" not in data:
			data["deduplication_cfg"]=''
		res=yield Lag.inlist_update(self,data)
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新入端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新入端口组',ip_address,json.dumps(data)+'\ningroupname is not exsited',400)
			self.write(json.dumps({"status_code":400,"res":"ingroupname is not exsited"}))
			self.set_status(400,'not existed')
			
class ReplaceOutgroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=Lag.outlist_update(data)
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新出端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新出端口组',ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"update failed"}))
			self.set_status(400,'not existed')

class UpdateOutgroupHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=Lag.outlist_put(data)
		if(res==True):
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			self.write(json.dumps({"status_code":400,"res":"outgroupname is not exsited"}))
			self.set_status(400,'not existed')

class UpdatePortHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=Lag.interlist_update(data["type"],data["groupname"],data["port"])
		if  data["type"]=='Egress':
			log_name='出'
		else:
			log_name='入'
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新'+log_name+'端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新'+log_name+'端口组',ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"outgroupname is not exsited"}))
			self.set_status(400,'not existed')

class DeletePortHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=Lag.interlist_delete(data["type"],data["groupname"],data["port"])
		if  data["type"]=='Egress':
			log_name='出'
		else:
			log_name='入'
		if(res==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新'+log_name+'端口组',ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','更新'+log_name+'端口组',ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"outgroupname is not  exsited"}))
			self.set_status(400,'not existed')

class getDefaultRuleInterfaceHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		data2=Lag.getDefaultInterface()
		data1={
				"status_code": 200,
				"message": "success",
				"data": data2
				}
		self.set_status(200,'')
		self.write(json.dumps(data1))


if __name__ == "__main__":
	app = Application(
		[	(r"/api/policy/ListIngroup",ListIngroupHandler),
			(r"/api/policy/InsertIngroup",InsertIngroupHandler),
			(r"/api/policy/DeleteIngroup",DeleteIngroupHandler),
			(r"/api/policy/UpdateIngroup",UpdateIngroupHandler),
			(r"/api/policy/ListOutgroup",ListOutgroupHandler),
			(r"/api/policy/InsertOutgroup",InsertOutgroupHandler),
			(r"/api/policy/DeleteOutgroup",DeleteOutgroupHandler),
			(r"/api/policy/UpdatePort",UpdatePortHandler),
			(r"/api/policy/UpdatePort",DeletePortHandler),
			(r"/api/policy/UpdateOutgroup",UpdateOutgroupHandler)],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()
