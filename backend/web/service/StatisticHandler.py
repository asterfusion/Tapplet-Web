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
import statistic
import Logconfig
import BaseHandler
from Logconfig import Web_log,Get_Sys_Log
Open_permiss=1

class GetStatisticHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		if data['real_time']==0:
			data1=statistic.get_statistic_data(data['otype'],data)
		else:
			data1=statistic.get_real_time_data(data['otype'],data)
		self.set_status(200,'success')
		self.write(json.dumps(data1))

class GetStatisticAllHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def post(self):
		self.set_header("Content-Type","application/json")
		data=data_operation.ByteToJson(self.request.body)
		data1=statistic.get_statistic_data(data['otype'],data,1)
		self.set_status(200,'success')
		self.write(json.dumps(data1))


class GetStatisticGroupHandler(BaseHandler.BaseHandler):
	executor =ThreadPoolExecutor(10)
	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare()
		except :
			self.set_status(400,'')
	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		data_group=statistic.get_statistic_group()
		data1={"status_code":200,"data":data_group,"message":"success"}
		self.set_status(200,'success')
		self.write(json.dumps(data1))


class GetStatisticExcelHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self, *args, **kwargs):
		ip_address=self.request.remote_ip
		self.set_header("Content-Type","application/json")
		statistic.get_xlsx_data()
		self.set_header('Content-Type', 'application/octet-stream')
		self.set_header('Content-Disposition', 'attachment; filename=StatisticData.xlsx')
		try:
			with open('./data/app_data/StatisticData.xlsx', 'rb') as f:
				while True:
					data = f.read(4096)
					if not data:
						break
					self.write(data)
			yield Logconfig.Write_Sys_Log(self,self.username,'数据统计','导出日志',ip_address,' ',200)
			self.finish()
			return
		except Exception:
			pass
			self.write(json.dumps({"status_code":400,"res":"someting wrong"}))
			self.set_status(400)
			self.finish()
if __name__ == "__main__":
	app = Application(
		[
			(r"/api/statistics/queryStatistics", GetStatisticHandler),
			(r"/api/statistics/queryTrend",GetStatisticAllHandler),
			
			
 ],cookie_secret="12334")

	app.listen(8001)
	debug = True

	IOLoop.current().start()

