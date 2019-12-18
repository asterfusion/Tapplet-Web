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
from os import  system
import Policy_config
import database_default
import permiss
import session
import Reset
import data_operation
import dataconfig
import interface_http
import Logconfig
import databasetime
import BaseHandler
def exec_success(cmd):
	status = system(cmd)
	if status == 0:
		return True
	return False
Open_permiss=0
class SystemConfigHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			prepare_text=''
			if self.request.method=='GET':
				prepare_text='policy_read'
			elif self.request.method=='POST':
				prepare_text='policy_write'
			super().prepare(prepare_text)
		except :
			self.set_status(400,'')

	@gen.coroutine
	def post(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		file_metas = self.request.files.get('shm_config', None)
		if file_metas:
			for meta in file_metas:
				filename = meta['filename']
				if filename == 'data_policy.gz':
					with open('./data/app_data/data_policy.gz', 'wb') as f:
						f.write(meta['body'])
					if exec_success('tar -zxf ./data/app_data/data_policy.gz  -C ./data/database'):
						exec_success('mv ./data/database/shm_config.bin.gz ./data/app_data')
						Policy_config.post_policy()
						yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','导入配置',ip_address,' ',200)
						self.finish()
				else:
					yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','导入配置',ip_address,'cant find filename',400)
					self.write(json.dumps({"status_code":400,"res":"cant find filename"}))
					self.set_status(400)
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','导入配置',ip_address,'cant find file',400)
			self.write(json.dumps({"status_code":400,"res":"cant find file"}))
			self.set_status(400)

	@gen.coroutine
	def get(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header('Content-Type', 'application/octet-stream')
		self.set_header('Content-Disposition', 'attachment; filename=data_policy.gz')
		try:
			Policy_config.get_policy()
			exec_success('mv ./data/app_data/shm_config.bin.gz ./data/database')
			exec_success('tar -czf ./data/app_data/data_policy.gz  -C ./data/database lag.db shm_config.bin.gz')
			exec_success('mv ./data/database/shm_config.bin.gz ./data/app_data')
			with open('./data/app_data/data_policy.gz', 'rb') as f:
				while True:
					data = f.read(4096)
					if not data:
						break
					self.write(data)
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','导出配置',ip_address,' ',200)
			self.finish()
			return
		except:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','导出配置',ip_address,'someting wrong',400)
			self.write(json.dumps({"status_code":400,"res":"someting wrong"}))
			self.set_status(400)
			self.finish()


class SystemTimeHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			prepare_text=''
			if self.request.method=='GET':
				prepare_text='time_read'
			elif self.request.method=='POST':
				prepare_text='time_write'
			super().prepare(prepare_text)
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res=yield dataconfig.do_time_set(self,data["id"])
		if res==True:
			con = sqlite3.connect(database_default.interface_db)
			c=con.cursor()
			c.execute("Delete from in_out_day")
			con.commit()
			con.close()
			self.write(json.dumps({"status_code":200,"message":"successd"}))
			self.set_status(200,'')
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','时区配置',ip_address,'',200)
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','时区配置',ip_address,'reset failed',400)
			self.write(json.dumps({"status_code":400,"res":"reset failed"}))
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		dataconfig.getCfgConfig()
		self.write(json.dumps({"status_code":200,"data":dataconfig.id_of_world,"message":"successd"}))
		self.set_status(200,'')

class SystemTimeConfigHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			prepare_text=''
			if self.request.method=='GET':
				prepare_text='time_read'
			elif self.request.method=='POST':
				prepare_text='time_write'
			super().prepare(prepare_text)
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		res= databasetime.PatchSystemTime(data['time'])
		if res==True:
			con = sqlite3.connect(database_default.interface_db)
			c=con.cursor()
			c.execute("Delete from in_out_day")
			con.commit()
			con.close()
			self.write(json.dumps({"status_code":200,"message":"successd"}))
			self.set_status(200,'')
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','时间配置',ip_address,'',200)
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'系统配置','时间配置',ip_address,'reset failed',400)
			self.write(json.dumps({"status_code":400,"res":"reset failed"}))
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		str1=databasetime.GetNow()
		self.write(json.dumps({"status_code":200,"data":str1,"message":"successd"}))
		self.set_status(200,'')

if __name__ == "__main__":
	app = Application(
		[	(r"/api/policy/SystemConfigHandler",SystemConfigHandler),
			(r"/api/policy/SystemTime",SystemTimeHandler),],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()


