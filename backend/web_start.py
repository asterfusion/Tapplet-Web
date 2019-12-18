#!/usr/bin/python
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
import os
import subprocess
import sys
#sys_path_saved = sys.path
#sys.path =['/opt/sfweb/backend']
sys.path.append('./web/service/')
sys.path.append('./web/control/')
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from new_app import *
from web.control.ssl import *
from Logconfig import Web_log
from web.control.interface_http import start_listen
from tornado.options import (
        options,
        parse_command_line
        )
import RestApiLogin
#sys.path = sys_path_saved
options.logging = "DEBUG"
options.log_file_max_size = 2097152
options.log_file_num_backups = 3
options.log_file_prefix = "./data/Web_res.log"      
def start_web():
    
    parse_command_line()
    RestApiLogin.TestLogin()
    application =  WebApplication()

    create_ssl_pki()
    start_listen()
    #HTTP_server = tornado.httpserver.HTTPServer(application)
    #HTTP_server.listen(options.HTTP_PORT, options.listen)
    HTTP_server = HTTPServer(application)
    HTTP_server.listen(83)

    HTTPS_server = HTTPServer(application, ssl_options={
        "certfile": SSL_CRT_FILE,
        "keyfile": SSL_PRIV_KEY_FILE})
    HTTPS_server.listen(84)
    IOLoop.instance().start()

if __name__ == "__main__":
    #multiprocessing.freeze_support() 
    start_web()

