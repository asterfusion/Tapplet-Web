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
import sqlite3
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
from tornado import gen
from os import system
import permiss
import session
import data_operation
import Common_config
import static_interface
import Logconfig
import BaseHandler

Open_permiss=0

class PatchHostNameHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('hostname_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)#print(data)
		re=Common_config.patch_hostname(data)
		if re==True:
			static_interface.System_info.GetSystemInfo()
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','主机名修改',ip_address,json.dumps(data),200)
			self.write(json.dumps({"status_code":200,"res":"patch OK"}))
			self.set_status(200,'')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','主机名修改',ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"patch failed"}))
			self.set_status(400,'')
	

class PatchVppHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			prepare_text=''
			if self.request.method=='GET':
				prepare_text='setting_read'
			elif self.request.method=='POST':
				prepare_text='setting_write'
			super().prepare(prepare_text)
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)#print(data)
		if data['op']=='start':
			re=Common_config.start_vpp()
		elif data['op']=="stop":
			re=Common_config.stop_vpp()
		else:
			re=0
		if re==True:
			static_interface.Status.GetStatus()
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','vpp'+data['op'],ip_address,json.dumps(data),200)
			self.write(json.dumps({"status_code":200,"res":"success"}))
			self.set_status(200,'')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','vpp'+data['op'],ip_address,json.dumps(data),400)
			self.write(json.dumps({"status_code":400,"res":"patch failed"}))
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self, *args, **kwargs):
		self.set_header("Content-Type","application/json")
		data1=Common_config.get_vpp_status()
		if data1:
			self.write(json.dumps({"status_code":200,"message":"success","data":data1}))
			self.set_status(200,'')
		else:
			self.write(json.dumps({"status_code":400,"res":"get failed"}))
			self.set_status(400,'')

if __name__ == "__main__":
	app = Application(
		[
		(r"/api/common/HostnameConfig",PatchHostNameHandler),],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()


