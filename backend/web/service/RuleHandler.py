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

import Action_to_rule
import data_operation
import interface_http
import permiss
import Rule
import session
import User
import Logconfig
from Logconfig import Web_log
import BaseHandler

sys.path.append('./web/control/')
sys.path.append('./web/database/')

Open_permiss=0
Chongfu=0

class ListRuleGroupHandler(BaseHandler.BaseHandler):
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
		try:
			cookie_str=data_operation.ByteToStr(self.get_secure_cookie("str"))
		except:
			cookie_str=''
			username='zxvbcjshdaiuhfdabvdavs'		#权限验证
		if cookie_str :
			username=yield session.Session.DitGet(self,cookie_str)
		permiss_value=yield permiss.permiss_data.PermissTest(self,username,'policy_read')
		if (Open_permiss or permiss_value):
			data=data_operation.ByteToJson(self.request.body)
			#print(data)
			Rulelist=Rule.rulegroup_select(data["rulegroupname"])
			RuleData=json.dumps(Rulelist)
			self.write(RuleData)
		else:
			self.write(json.dumps('no permissions'))
			self.write(json.dumps({"status_code":401}))
	@tornado.gen.coroutine	
	def get(self):
		self.set_header("Content-Type","application/json")
		try:
			cookie_str=data_operation.ByteToStr(self.get_secure_cookie("str"))
		except:
			cookie_str=''
			username='zxvbcjshdaiuhfdabvdavs'		#权限验证
		if cookie_str :
			username=yield session.Session.DitGet(self,cookie_str)
		permiss_value=yield permiss.permiss_data.PermissTest(self,username,'policy_read')
		if (Open_permiss or permiss_value):
			list1=Rule.rulegroup_list()
			self.write(json.dumps(list1))
			self.set_status(200,'')
		else:
			self.write(json.dumps('no permissions'))
			self.write(json.dumps({"status_code":401}))

class InsertRuleGroupHandler(BaseHandler.BaseHandler):
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
		res=Rule.rulegroup_write(data)
		if(res==True):
			if len(data["rule"]) != 0:
				re=Action_to_rule.action_to_rulegroup(data["ingroupname"],data["outgroupname"],data["rulegroupname"])
			else:
				re=Action_to_rule.default_action(data["ingroupname"],data["outgroupname"])
			re_sync = yield Rule.rule_sync(self)
			if re==True and re_sync==True:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data),200)
				self.set_status(200,'OK')
				self.write(json.dumps("RuleGroup insert ok"))
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nfailed Action_to_rule',400)
				self.write(json.dumps({"status_code":400,"res":"Action_to_rule"}))
				self.set_status(400,'XX')
		elif Rule.Chongfu==0:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nfailed rule_group_write',400)
			self.write(json.dumps({"status_code":400,"res":"rule_group_write"}))
			self.set_status(400,'XX')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nfailed rule_group_write',400)
			self.write(json.dumps({"status_code":4002,"res":"rule_group_write"}))
			self.set_status(4002,'XX')



class InsertRuleHandler(BaseHandler.BaseHandler):
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
		res_data=Rule.rule_write(data)
		res=res_data['data']
		if (len(data["rule"]) == len(res) and res!=[]):	
			for i in res:
				re=Action_to_rule.action_to_rule(i,'','','',data['rulegroupname'])
				#print(i,re)
			Rule.rule_des_update(data)
			re_sync = yield Rule.rule_sync(self)
			if re_sync:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则',ip_address,json.dumps(data),200)
				self.set_status(200,'OK')
				self.write(json.dumps("Rule insert ok"))
			else:
				yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则',ip_address,json.dumps(data),400)
				self.set_status(400,'OK')
				self.write(json.dumps("sync failed"))
		elif (res==[] and len(data["rule"]) == len(res)):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nrule_write failed',400)
			Rule.rule_des_update(data)
			self.write(json.dumps('no update: rule_write'))
			self.set_status(200,'XX')
		elif res_data['message']=='re' and res==[]:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nRule insert failed',402)
			self.set_status(4002,'fail')
			self.write(json.dumps("Rule insert failed"))
		elif res_data['message']=='re' :
			Rule.only_delete_rule(res)
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nRule insert failed',402)
			self.set_status(4002,'fail')
			self.write(json.dumps("Rule insert failed"))
		elif res==[] :
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nRule insert failed',400)
			self.set_status(4001,'fail')
			self.write(json.dumps("Rule insert failed"))
		else:
			Rule.only_delete_rule(res)
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','添加规则组',ip_address,json.dumps(data)+'\nRule insert failed',400)
			self.set_status(4001,'fail')
			self.write(json.dumps("Rule insert failed"))
	
class DeleteRuleGroupHandler(BaseHandler.BaseHandler):
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
		if "ruleid" in data:
			log_name='规则'
			data1=data["rulegroupname"]
			data2=data["ruleid"]
			res=Rule.rule_delete(data1,data2)
		else:
			log_name='规则组'
			data1=data["rulegroupname"]
			res=Rule.rulegroup_delete(data1)
		re_sync = yield Rule.rule_sync(self)
		if(res==True and re_sync==True):
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除'+log_name,ip_address,json.dumps(data),200)
			self.write(json.dumps('OK'))
			self.set_status(200,'ok')
		else:
			yield Logconfig.Write_Sys_Log(self,self.username,'转发策略','删除'+log_name,ip_address,json.dumps(data)+'\nnot existed',400)
			self.write(json.dumps({"status_code":400,"res":"Rulegroup is not existed"}))
			self.set_status(400,'not existed')
			

"""			

if __name__ == "__main__":
	app = Application(
		[	(r"/api/policy/ListRuleGroup",ListRuleGroupHandler),
			(r"/api/policy/InsertRuleGroup",InsertRuleGroupHandler),
			(r"/api/policy/DeleteRuleGroup",DeleteRuleGroupHandler),
			(r"/api/policy/InsertRule",InsertRuleHandler),
			],cookie_secret="12334")

	app.listen(8000)

	IOLoop.current().start()
"""
