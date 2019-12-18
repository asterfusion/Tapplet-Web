#!/usr/bin/python3
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import json
import sys
import logging
sys.path.append('./web/control/')
import User 
import permiss 
import session
import static_interface
import interface_http
import data_operation
from Logconfig import Web_log
import BaseHandler
Open_permiss=1
class ListStatusHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Status_value=static_interface.Status_Dict
		self.write(json.dumps({"status_code":200,"message":"successd","data":Status_value}))
			
class ListStatHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Xid = self.get_argument('Xid', 'All')
		Status_value=static_interface.Stat_Dict
		self.write(json.dumps({"status_code":200,"message":"successd","data":Status_value}))

			
class ListStatusTreadHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Status_value=yield interface_http.Stat.ListDbdata(self)
		self.write(json.dumps({"status_code":200,"message":"successd","data":Status_value}))
			
class ListSystemInfoHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Status_value=static_interface.Systeminfo_Dict
		self.write(json.dumps({"status_code":200,"message":"successd","data":Status_value}))

class ListSystemUsingHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		Status_value=static_interface.SystemUsing_Dict
		self.write(json.dumps({"status_code":200,"message":"successd","data":Status_value}))

class GetInterfaceNumHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('role_read')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		interface_num=static_interface.GetNumOfSys()
		self.write(json.dumps({"status_code":200,"message":"successd","data":interface_num}))

if __name__ == "__main__":
    app = Application(
    	[
    		(r"/api/home/ListInterfaceStat",ListStatHandler),
    		(r"/api/home/ListInterfaceStatus",ListStatusHandler),
    		(r"/api/home/ListStatusTread",ListStatusTreadHandler),
    		(r"/api/home/SystemInfo",ListSystemInfoHandler),
    		(r"/api/home/SystemUsing",ListSystemUsingHandler),
			(r"/api/home/GetInterfacesNum",GetInterfaceNumHandler)
    		
    		
    		
 ],cookie_secret="12334")

    app.listen(8000)

    IOLoop.current().start()
