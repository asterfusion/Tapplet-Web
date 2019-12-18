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
sys.path.append('./web/config/')
import User
import PermissHandler 
import session 
import urllib.parse
import permiss				
import data_operation
import Logconfig
import BaseHandler
from Logconfig import Web_log,Get_Sys_Log
Open_permiss=0

class GetLogExcelHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('log_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		Logconfig.write_xlsx_data()
		self.set_header('Content-Type', 'application/octet-stream')
		self.set_header('Content-Disposition', 'attachment; filename=LogData.xlsx')
		try:
			with open('./data/app_data/LogData.xlsx', 'rb') as f:
				while True:
					data = f.read(4096)
					if not data:
						break
					self.write(data)
			yield Logconfig.Write_Sys_Log(self,self.username,'日志管理','导出日志',ip_address,' ',200)
			self.finish()
			return
		except Exception:
			pass
			yield Logconfig.Write_Sys_Log(self,self.username,'日志管理','导出日志',ip_address,' ',400)
			self.write(json.dumps({"status_code":400,"res":"someting wrong"}))
			self.set_status(400)
			self.finish()

class GetSystemLogHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('log_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		head = self.request.headers
		languages=head.get('lang','zh-CN')
		pagesize=self.get_argument('pagesize','')
		page=self.get_argument('page','')
		sort_field=self.get_argument('sort_field','')
		sort_order=self.get_argument('sort_order','')
		username=urllib.parse.unquote(self.get_argument('username',''))
		module=urllib.parse.unquote(self.get_argument('module',''))
		operate=urllib.parse.unquote(self.get_argument('operate',''))
		username.encode('utf-8').decode('unicode_escape')
		module.encode('utf-8').decode('unicode_escape')
		operate.encode('utf-8').decode('unicode_escape')
		ip_address=self.get_argument('ip_address','')
		start_time=self.get_argument('start_time','')
		end_time=self.get_argument('end_time','')
		#print(pagesize,page,sort_field,sort_order,username,module,operate,ip_address,start_time,end_time)
		data1=Get_Sys_Log(languages,pagesize,page,sort_field,sort_order,username,module,operate,ip_address,start_time,end_time)
		self.write(json.dumps(data1))

class GetWaringLogHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('waringlog_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		data2={}
		data1={
				"code": 200,
				"message": "success",
				"total_count":5,
				"data": [{
					"waring_type": "未知故障一",
					"waring_level": "EMERGENCIES",
					"content": "未知原因一",
					"time": "2019-10-11 10:28:29"
				},{"waring_type": "风扇故障",
					"waring_level": "ERROR",
					"content": "用户密码错误",
					"time": "2019-10-11 10:30:29"}
					,{"waring_type": "未知故障二",
					"waring_level": "ALERT",
					"content": "未知原因二",
					"time": "2019-9-11 10:30:29"}
					,{"waring_type": "未知故障三",
					"waring_level": "CRITICAL",
					"content": "未知原因三",
					"time": "2019-8-11 10:30:29"}
					,{"waring_type": "未知故障四",
					"waring_level": "WARNING",
					"content": "未知原因四",
					"time": "2019-12-11 10:30:29"}]
				}
		self.set_status(200,'success')
		self.write(json.dumps(data2))
			

if __name__ == "__main__":
    app = Application(
    	[
    		(r"/api/log/getWaringLog", GetWaringLogHandler),
    		(r"/api/log/getSysLog",GetSystemLogHandler),
			(r"/api/log/getSysLogExcel",GetLogExcelHandler),
    		
    		
 ],cookie_secret="12334")

    app.listen(8001)
    debug = True

    IOLoop.current().start()

