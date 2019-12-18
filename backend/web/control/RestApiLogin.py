#!/usr/bin/python3
import sys
sys.path.append('./web/config/')
sys.path.append('./web/control/')
sys.path.append('./web/database/')
import requests
import urllib3
import databasetime
import time
import datetime
import dataconfig


urllib3.disable_warnings()


def rest_login():											####登录Session方法
	c=requests.Session()
	c_se=c.post(url=dataconfig.login_url,data=dataconfig.login_data,verify=False).text
	return c


def rest_login_code():											####登录Session方法
	c=requests.Session()
	c_se=c.post(url=dataconfig.login_url,data=dataconfig.login_data,verify=False).status_code
	return c_se	
														  ####登出Session方法
def rest_logout(c):
	c.post(url=dataconfig.logout_url,data=dataconfig.login_data,verify=False)	
	return True

def restart_login():
	global r
	test_num=0
	while(test_num<36):
		c=requests.Session()
		c_se=c.post(url=dataconfig.login_url,data=dataconfig.login_data,verify=False)
		if c_se.status_code==200:
			r=rest_login()
			return True
		else:
			test_num+=1
			time.sleep(5)
	return False

r=rest_login()


def Logintest():
		while(True):
			global r
			time_ob=(datetime.datetime.now())
			str_time = datetime.datetime.strftime(time_ob,'%H:%M')
			#str_time=time.strftime("%H:%M",time.localtime())			##开启服务器时可能会有一分钟读不到信息
			time_str=databasetime.GetTimeHours()
			time.sleep(int(time_str))
			r = rest_login()

def TestLogin():
	num=0
	while(num<10000):
		try:
			test_r = rest_login_code()
			if test_r==200:
				num=10001
				return True
			else:
				time.sleep(30)
				num+=1
		except:
			time.sleep(30)
			num+=1
	return False


TestLogin()