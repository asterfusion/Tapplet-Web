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
import Rule
import database_default
import data_operation
import RestApiLogin
import dataconfig
import Lag
urllib3.disable_warnings()

def reset_policy():
	con = sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	c.execute("Delete from action where actid not in (0)")
	c.execute("update action set basisconfig=1,additionalconfig='[]' where actid = 0")
	c.execute("Delete from ingroup")
	c.execute("Delete from outgroup")
	c.execute("Delete from rule where ruleid not in (0)")
	c.execute("update rule set groupid=1,description='[]' where ruleid = 0")
	c.execute("Delete from rulegroup")
	c.execute("update default_interface set value=0")
	data_to_reset=[{"op":"replace","path":"/","value":1}]
	re=RestApiLogin.r.patch(url=dataconfig.reset_url,data=json.dumps(data_to_reset),verify=False)
	if re.status_code==204:
		con.commit()
		con.close()
		return True
		
def save_all_config():
	data_save=[{"op": "replace", "path": "/", "value":1}]
	re=RestApiLogin.r.patch(url=dataconfig.save_all_config_url,data=json.dumps(data_save),verify=False)
	if re.status_code==204:
		return True
	else:
		return False
	
