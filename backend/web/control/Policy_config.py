#!/usr/bin/python3
import sqlite3
import json
import threading
import requests
import urllib3
import datetime
import time
import asyncio
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
import RestApiLogin
import dataconfig
urllib3.disable_warnings()

def get_policy():
	re=RestApiLogin.r.get(url=dataconfig.reset_url,verify=False)
	re.raise_for_status()
	playFile = open('./data/app_data/shm_config.bin.gz', 'wb')
	for chunk in re.iter_content(100000):
	    playFile.write(chunk)
	playFile.close()
	return True


def post_policy():
	data = None
	files={"shm_config" : ("shm_config.bin.gz", open("./data/app_data/shm_config.bin.gz", "rb"), "application/gzip")}
	re=RestApiLogin.r.post(dataconfig.reset_url,data,files=files)
	if(re.status_code==200):
		return True
	else:
		return False
	


"""
/rootfs/rest/web/database/shm_config.bin.gz
"""