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
import session
import data_operation
from ExcpetApi import *
import session
import permiss
import permiss_static


class BaseHandler(RequestHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)
        self.username='Unknown'
    
    def ifLogin(self):
        try:
            self.set_header("Content-Type","application/json")
            username_init=False
            cookie_str=data_operation.ByteToStr(self.get_secure_cookie("str"))
            if cookie_str :
                username_init=session.Session.DitGet_st(cookie_str)
            if username_init==False:
                raise RuntimeError
            else:
                self.username=username_init
        except:
            raise LoginFailed('Please Login')

    def prepare(self,text=''):
        try:
            self.ifLogin()
            if text!='':
                self.Check_Permiss(text)
        except Exception as e:
            self.on_exception(e)
            self.finish()

    def on_exception(self, e):
        self.error_message = str(e)
        self.set_status(e.status_code)
        self.write(self.error_message)

    def Check_Permiss(self,text):
        try:
            permiss_value= permiss_static.permiss_data.PermissTest(self.username,text)
            if permiss_value==False or permiss_value==0:
                raise RuntimeError
        except:
            raise PermissFailed('no permiss')
    