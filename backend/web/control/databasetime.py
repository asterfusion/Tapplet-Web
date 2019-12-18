#!/usr/bin/python3
import sqlite3
import datetime
import threading
import sys
sys.path.append('./web/config/')
import dataconfig
from os import  system
import database_default

	

	
def GetTime():
	now_time = datetime.datetime.now()
	# 获取明天时间
	next_time = now_time + datetime.timedelta(days=+1)
	next_year = next_time.date().year
	next_month = next_time.date().month
	next_day = next_time.date().day
	# 获取明天0点时间
	next_time = datetime.datetime.strptime(str(next_year)+"-"+str(next_month)+"-"+str(next_day)+" 00:00:01", "%Y-%m-%d %H:%M:%S")
	# # 获取昨天时间
	#last_time = now_time + datetime.timedelta(days=-1)
	# 获取距离明天3点时间，单位为秒
	timer_start_time = (next_time - now_time).total_seconds()
	return timer_start_time

def GetNow():
	now_time = datetime.datetime.now()
	str_now=now_time.strftime("%Y-%m-%d %H:%M:%S")
	return str_now

	
def GetTimeMinute():
	now_time = datetime.datetime.now()
	if (now_time.second>30):
		next_time=now_time+datetime.timedelta(minutes=1)
	else:
		next_time = now_time
	next_year = next_time.date().year
	next_month = next_time.date().month
	next_day = next_time.date().day
	next_hour= next_time.hour
	next_min= next_time.minute
	next_time = datetime.datetime.strptime(str(next_year)+"-"+str(next_month)+"-"+str(next_day)+" "+str(next_hour)+":"+str(next_min)+":30", "%Y-%m-%d %H:%M:%S")
	start_time=(next_time - now_time).total_seconds()
	return start_time

def GetTimeHours():
	now_time = datetime.datetime.now()
	next_time=now_time+datetime.timedelta(hours=1,minutes=50)
	next_year = next_time.date().year
	next_month = next_time.date().month
	next_day = next_time.date().day
	next_hour= next_time.hour
	next_min= next_time.minute
	next_time = datetime.datetime.strptime(str(next_year)+"-"+str(next_month)+"-"+str(next_day)+" "+str(next_hour)+":"+str(next_min)+":00", "%Y-%m-%d %H:%M:%S")
	start_time=(next_time - now_time).total_seconds()
	return start_time


def GetStatisticTime():
	now_time = datetime.datetime.now()
	next_time=now_time+datetime.timedelta(hours=1)
	next_year = next_time.date().year
	next_month = next_time.date().month
	next_day = next_time.date().day
	next_hour= next_time.hour
	next_min= next_time.minute
	next_time = datetime.datetime.strptime(str(next_year)+"-"+str(next_month)+"-"+str(next_day)+" "+str(next_hour)+":00:00", "%Y-%m-%d %H:%M:%S")
	start_time=(next_time - now_time).total_seconds()#print(now_time)
	data_list=[start_time,now_time.date().month,now_time.date().day,now_time.hour]#print(data_list)
	return data_list

def exec_success(cmd):
	status = system(cmd)
	if status == 0:
		return True
	return False

def PatchSystemTime(date):
	before_time=datetime.datetime.now()
	user_time=datetime.datetime.strptime(date,"%Y-%m-%d %H:%M:%S")
	system_time=user_time
	sys_time_day=system_time.strftime("%Y-%m-%d")
	sys_time_second=system_time.strftime("%H:%M:%S")
	exec_success('timedatectl set-time %s'%sys_time_day)
	exec_success('timedatectl set-time %s'%sys_time_second)
	return True
	#日志的时间修改
	#数据统计的时间修改
