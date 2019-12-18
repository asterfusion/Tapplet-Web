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
from Logconfig import Web_log
import Reset
import static_interface
import Logconfig
import BaseHandler
Open_permiss=0

class SaveConfigHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('configwrite_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		res=Reset.save_all_config()
		if res==True:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','保存配置',ip_address,' ',200)
			self.write(json.dumps('ok'))
			self.set_status(200,'')
			Web_log.info('save OK by %s'%self.username)
		else:
			yield  Logconfig.Write_Sys_Log(self,self.username,'系统配置','保存配置',' ',400)
			self.write(json.dumps({"status_code":400,"res":"save failed"}))
			Web_log.info('Save Failed by %s'%self.username)
			self.set_status(400,'')

class ResetConfigHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('configreset_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		res=Reset.reset_policy()
		if res==True:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','复位配置',ip_address,' ',200)
			self.write(json.dumps('ok'))
			self.set_status(200,'')
			Web_log.info('reset OK by %s'%self.username)
		else:
			self.write(json.dumps({"status_code":400,"res":"reset failed"}))
			Web_log.info('Reset Failed by %s'%self.username)
			self.set_status(400,'')


if __name__ == "__main__":
	app = Application(
		[	(r"/api/system/SaveConfig",SaveConfigHandler),
			(r"/api/system/ResetConfig",ResetConfigHandler),],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()
