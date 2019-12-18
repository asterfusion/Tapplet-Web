#!/usr/bin/python3
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sqlite3
import json
import hashlib                                
import time 
NameDit={}

class Session:
		
	def GetRandomStr():                                     
		global NameDit
		obj = hashlib.md5()                                     #创建md5加密对象
		obj.update(bytes(str(time.time()), encoding='utf-8'))   #获取系统当前时间，进行md5加密
		random_str = obj.hexdigest()                            #获取加密后的md5密串
		return random_str                                       #返回加密后的md5密串
	@run_on_executor
	def DitInsert(self,username):
		global NameDit
		str1=Session.GetRandomStr()
		NameDit[str1]=username
		return str1
	@run_on_executor
	def DitGet(self,str1):
		global NameDit
		if str1 in NameDit:
			username=NameDit[str1]
		else:
			return False
		return username

	def DitGet_st(str1):
		global NameDit
		if str1 in NameDit:
			username=NameDit[str1]
		else:
			return False
		return username
	@run_on_executor
	def DitDelete_exe(self,str1):
		global NameDit
		if str1 in NameDit:
			pop_obj=NameDit.pop(str1)
			return 1
		else:
			return 0
	def DitDelete(str1):
		global NameDit
		if str1 in NameDit:
			pop_obj=NameDit.pop(str1)
			return 1
		else:
			return 0
	@run_on_executor	
	def DitCheck(self,username):
		global NameDit
		str1=[]
		n=0
		for key, val in NameDit.items():
			if val == username:
				str1.append(key)
				n=n+1
		if(n>10):
			Session.DitDelete(str1[0])
			

