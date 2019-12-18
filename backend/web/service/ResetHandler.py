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
import BaseHandler

Open_permiss=0

class ResetPolicyHandler(BaseHandler.BaseHandler):
	executor = ThreadPoolExecutor(20)

	@tornado.gen.coroutine
	def prepare(self):
		try:
			super().prepare('policy_write')
		except :
			self.set_status(400,'')

	@tornado.gen.coroutine
	def get(self):
		self.set_header("Content-Type","application/json")
		res=Reset.reset_policy()
		if res==True:
			static_interface.Stat.GetStat('All')
			self.write(json.dumps('ok'))
			self.set_status(200,'')
			Web_log.info('Reset OK by %s'%self.username)
		else:
			self.write(json.dumps({"status_code":400,"res":"reset failed"}))
			Web_log.info('Reset Failed by %s'%self.username)
			self.set_status(400,'')


if __name__ == "__main__":
	app = Application(
		[	(r"/api/policy/ResetPolicy",ResetPolicyHandler),],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()
