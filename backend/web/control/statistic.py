#!/usr/bin/python3
import sqlite3
import json
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
import tornado.autoreload
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
import User
import permiss_static
import permiss
import database_default
import RestApiLogin
import dataconfig
import databasetime
import time
import threading
import datetime
import static_interface
import xlsxwriter

Open_permiss=0  #quanxian kaiqi

type_xlsx='port'
data_xlsx=''
all_num_xlsx=''
op_db_hours='Select * from portdata'
op_db_days='Select * from portdata_day'
StatisticData_pass='./data/app_data/'

def get_xlsx_data():
	xlsx_hour=[]
	xlsx_day=[]
	if data_xlsx!='':
		data_xlsx['scale']='hour'
		data_hour=get_statistic_data(type_xlsx,data_xlsx,'xlsx')
		data_xlsx['scale']='day'
		data_day=get_statistic_data(type_xlsx,data_xlsx,'xlsx')
		for dict_i in data_hour['data']:
			data_hour=[dict_i['time'],data_xlsx['object'],
			dict_i['drop_packets'],dict_i['in_bps'],dict_i['in_octets'],
			dict_i['in_packets'],dict_i['in_pps'],dict_i['out_bps'],
			dict_i['out_octets'],dict_i['out_packets'],dict_i['out_pps']]
			xlsx_hour.append(data_hour)
		for dict_y in data_day['data']:
			data_day=[dict_y['time'],data_xlsx['object'],dict_y['max_in_bps'],
			dict_y['min_in_bps'],dict_y['max_in_pps'],dict_y['min_in_pps'],
			dict_y['max_out_bps'],dict_y['min_out_bps'],dict_y['max_out_pps'],
			dict_y['min_out_pps'],dict_y['ave_in_bps'],dict_y['ave_in_pps'],
			dict_y['ave_out_bps'],dict_y['ave_out_pps']]
			xlsx_day.append(data_day)
		write_xlsx(xlsx_hour,xlsx_day)
	else:
		con=sqlite3.connect(database_default.statistic_db)
		c=con.cursor()
		c.execute("select * from portdata")
		res_hour=c.fetchall()
		if res_hour:
			for i in res_hour:
				data_hour=[]
				for y in range(11):
					data_hour.append(i[y])
				xlsx_hour.append(data_hour)
		else:
			pass
		c.execute("select * from portdata_day")
		res_day=c.fetchall()
		if res_day:
			for i in res_day:
				data_day=[]
				for y in range(15):
					if y!=2:
						data_day.append(i[y])
					else:
						pass
				xlsx_day.append(data_day)
		else:
			pass
		if xlsx_day!=[] and xlsx_hour!=[]:
			write_xlsx(xlsx_hour,xlsx_day)
		else:
			pass

def write_xlsx(data_log_hour,data_log_day):
	workbook = xlsxwriter.Workbook(StatisticData_pass+'StatisticData.xlsx')
	ItemStyle_data = workbook.add_format({
		'font_size':10,                 #字体大小
		'bold':False,                   #是否粗体
		'align':'center_across',                #居中对齐
		'valign':'vdistributed',
		'top':1,                     #上边框 
														#后面参数是线条宽度
		'left':1,                    #左边框
		'right':1,                    #右边框
		'bottom':1                    #底边框
		})  # 设置输出路径为当前目录下
	ItemStyle_tatol = workbook.add_format({
		'font_size':10,                 #字体大小
		'bold':True,                   #是否粗体
		'align':'center_across',                #居中对齐
		'valign':'vdistributed',                #居中对齐
		'top':1,                     #上边框       #后面参数是线条宽度
		'left':1,                    #左边框
		'right':1,                    #右边框
		'bottom':1                    #底边框
		})  # 设置输出路径为当前目录下
	worksheet_hours = workbook.add_worksheet('hours')
	worksheet_days = workbook.add_worksheet('days')
	if len(data_log_hour)!=0:
		data=['time','port','drop_packets','in_bps','in_octets','in_packets','in_pps','out_bps','out_octets','out_packets','out_pps']
		row=1
		col=0
		for n in range(11):
			worksheet_hours.write(0,col+n,data[n],ItemStyle_tatol)	
		for i in data_log_hour:
			for n in range(11):
				worksheet_hours.write(row,col+n,i[n],ItemStyle_data)	
			row+=1
	else:
		worksheet_hours.write(0,0,'')	
	if len(data_log_day)!=0:
		data=['time','object','max_in_bps','min_in_bps','max_in_pps','min_in_pps','max_out_bps','min_out_bps','max_out_pps','min_out_pps','ave_in_bps','ave_in_pps','ave_out_bps','ave_out_pps']
		row=1
		col=0
		for n in range(14):
			worksheet_days.write(0,col+n,data[n],ItemStyle_tatol)	
		for i in data_log_day:
			for n in range(14):
				worksheet_days.write(row,col+n,i[n],ItemStyle_data)	
			row+=1
	else:
		worksheet_days.write(0,0,'')		
	workbook.close()




def insert_statistic_data():
	now_time = datetime.datetime.now()
	delete_time = datetime.datetime.now()-datetime.timedelta(days=30)
	delete_day=delete_time.strftime("%Y-%m-%d")+" 00:00:00"
	time_db=now_time.strftime("%Y-%m-%d %H")+":00:00"
	time_day=now_time.strftime("%Y-%m-%d")
	con=sqlite3.connect(database_default.statistic_db)
	c=con.cursor()
	data=static_interface.Stat_Hour.get_Stat_Hour()
	try:
		c.execute("Delete from portdata where time < '%s'")%delete_day
		c.execute("Delete from portdata_day where time < '%s'")%delete_day
	except:
		pass
	num_port=static_interface.num_dict
	for i in range(1,num_port+1):
		port='G'+str(i)#print(port)
		data_port=data[port]
		try:
			c.execute("INSERT INTO portdata (time,port,drop_packets,in_bps,in_octets,in_packets,in_pps,out_bps,out_octets,out_packets,out_pps)\
				values ('%s','%s',%d,%d,%d,%d,%d,%d,%d,%d,%d)"%(time_db,port,data_port["drop_packets"],
				data_port["in_bps"],data_port["in_octets"],data_port["in_packets"],
				data_port["in_pps"],data_port["out_bps"],data_port["out_octets"],
				data_port["out_packets"],data_port["out_pps"]))
		except:
			c.execute("Delete from portdata where time = '%s' and port = '%s'"%(time_db,port))
			c.execute("INSERT INTO portdata (time,port,drop_packets,in_bps,in_octets,in_packets,in_pps,out_bps,out_octets,out_packets,out_pps)\
				values ('%s','%s',%d,%d,%d,%d,%d,%d,%d,%d,%d)"%(time_db,port,data_port["drop_packets"],
				data_port["in_bps"],data_port["in_octets"],data_port["in_packets"],
				data_port["in_pps"],data_port["out_bps"],data_port["out_octets"],
				data_port["out_packets"],data_port["out_pps"]))
		try:
			c.execute("INSERT INTO portdata_day (time,port,max_in_bps,min_in_bps,max_in_pps,min_in_pps,max_out_bps,min_out_bps,max_out_pps,min_out_pps,num,month_day_port,ave_in_bps,ave_in_pps,ave_out_bps,ave_out_pps)\
				values ('%s','%s',%d,%d,%d,%d,%d,%d,%d,%d,%d,'%s',%d,%d,%d,%d)"%(time_day+" 00:00:00",port,
				data_port["in_bps"],data_port["in_bps"],
				data_port["in_pps"],data_port["in_pps"],
				data_port["out_bps"],data_port["out_bps"],
				data_port["out_pps"],data_port["out_pps"],1,time_day+port,
				data_port["in_bps"],data_port["in_pps"],data_port["out_bps"],data_port["out_pps"]))
		except:
			c.execute("Select max_in_bps,min_in_bps,max_in_pps,min_in_pps,max_out_bps,min_out_bps,max_out_pps,min_out_pps,num,ave_in_bps,ave_in_pps,ave_out_bps,ave_out_pps from portdata_day where month_day_port='%s'"%(time_day+port))
			res_data=c.fetchone()
			if res_data:
				max_in_bps=res_data[0]
				min_in_bps=res_data[1]
				max_in_pps=res_data[2]
				min_in_pps=res_data[3]
				max_out_bps=res_data[4]
				min_out_bps=res_data[5]
				max_out_pps=res_data[6]
				min_out_pps=res_data[7]
				num=res_data[8]
				ave_in_bps=res_data[9]
				ave_in_pps=res_data[10]
				ave_out_bps=res_data[11]
				ave_out_pps=res_data[12]
				if data_port["in_bps"]>max_in_bps:
					max_in_bps=data_port["in_bps"]
				elif data_port["in_bps"]<min_in_bps:
					min_in_bps=data_port["in_bps"]
				else:
					pass
				if data_port["in_pps"]>max_in_pps:
					max_in_pps=data_port["in_pps"]
				elif data_port["in_pps"]<min_in_pps:
					min_in_pps=data_port["in_pps"]
				else:
					pass
				if data_port["out_bps"]>max_out_bps:
					max_out_bps=data_port["out_bps"]
				elif data_port["out_bps"]<min_out_bps:
					min_out_bps=data_port["out_bps"]
				else:
					pass
				if data_port["out_pps"]>max_out_pps:
					max_out_pps=data_port["out_pps"]
				elif data_port["out_bps"]<min_out_pps:
					min_out_pps=data_port["out_pps"]
				else:
					pass
				ave_in_bps=(ave_in_bps*num+data_port["in_bps"])/(num+1)
				ave_in_pps=(ave_in_pps*num+data_port["in_pps"])/(num+1)
				ave_out_bps=(ave_out_bps*num+data_port["out_bps"])/(num+1)
				ave_out_pps=(ave_out_pps*num+data_port["out_pps"])/(num+1)
				c.execute("UPDATE portdata_day set max_in_bps=%d,max_in_pps=%d,min_in_bps=%d,min_in_pps=%d,max_out_bps=%d,max_out_pps=%d,min_out_bps=%d,min_out_pps=%d,ave_in_bps=%d,ave_in_pps=%d,ave_out_bps=%d,ave_out_pps=%d,num=%d where month_day_port='%s'"%(max_in_bps,max_in_pps,min_in_bps,min_in_pps,max_out_bps,max_out_pps,min_out_bps,min_out_pps,ave_in_bps,ave_in_pps,ave_out_bps,ave_out_pps,num+1,(time_day+port)))
			else:
				pass
	con.commit()
	con.close()
	static_interface.Stat_Hour.reset_Stat_Hour()
	return True

def get_statistic_data(type1,data1,all_num=''):
	global type_xlsx
	global data_xlsx
	global all_num_xlsx
	type_xlsx=type1
	data_xlsx=data1
	all_num_xlsx=all_num 
	op_db=''
	name=data1['object']
	try:
		begin_time=data1['time'][0]+':00'
		end_time=data1['time'][1]+':00'
	except:
		begin_time=''
		end_time=''
	try:
		select_id=data1['page']
	except:
		select_id=1
	num=0
	num_group=0
	limit=24
	data_list=[]
	if type1=='port':
		if data1['scale']=='hour':
			op_db="select * from portdata where port ='%s'"%name
			if begin_time!='':
				op_start1=" and time>='%s'"%begin_time
				op_db=op_db+op_start1
			if begin_time!='':
				op_end1=" and time<='%s'"%end_time
				op_db=op_db+op_end1
			op_num="Select count(*) from (%s)"%(op_db)
			con=sqlite3.connect(database_default.statistic_db)
			c=con.cursor()
			c.execute(op_num)
			res=c.fetchone()
			if res:
				list_num=res[0]
			else:
				pass
			if all_num=='':
				op_limit=" limit %d offset %d "%(limit,(int(select_id)-1)*limit)
			elif all_num!='xlsx':
				if int(select_id)==1:
					num_page=0
				elif list_num<=48:
					num_page=0
				elif int(select_id)*24+12>=list_num:
					num_page=list_num-48
				else:
					num_page=int(select_id)*24-36
				op_limit=" limit %d offset %d "%(limit*2,num_page)
			else:
				op_limit=' '
			if begin_time=='' and end_time =='':
				op_db=op_db+" ORDER BY time DESC "
			else:
				op_db=op_db+" ORDER BY time ASC "
			if op_db!="":
				op_db=op_db+op_limit
			c.execute(op_db)
			res_statistic=c.fetchall()
			if res_statistic:
				for data_res in res_statistic:
					data_dict={
						"time":str(data_res[0]),
						"drop_packets":data_res[2],
						"in_bps":data_res[3],
						"in_octets":data_res[4],
						"in_packets":data_res[5],
						"in_pps":data_res[6],
						"out_bps":data_res[7],
						"out_octets":data_res[8],
						"out_packets":data_res[9],
						"out_pps":data_res[10]
						}
					data_list.append(data_dict)
			else:
				pass#print("no data")
			data_dict={
				"code":200,
				"message":"success",
				"dataNum":list_num,
				"data":data_list
				}
			return data_dict
		else:
			op_db="Select * from portdata_day where port ='%s'"%name
			if begin_time!='':
				op_start1=" and time>='%s'"%begin_time
				op_db=op_db+op_start1
			if begin_time!='':
				op_end1=" and time<='%s'"%end_time
				op_db=op_db+op_end1
			op_num="Select count(*) from (%s)"%op_db
			con=sqlite3.connect(database_default.statistic_db)
			c=con.cursor()
			c.execute(op_num)
			res=c.fetchone()
			if res:
				list_num=res[0]
			else:
				pass
			if begin_time=='' and end_time =='':
				op_db=op_db+" ORDER BY time DESC "
			else:
				op_db=op_db+" ORDER BY time ASC "
			c.execute(op_db)
			res_statistic_day=c.fetchall()
			if res_statistic_day:
				for data_res in res_statistic_day:
					data_dict={
						"time":str(data_res[0])[0:10],
						"max_in_bps":data_res[3],
						"min_in_bps":data_res[4],
						"max_in_pps":data_res[5],
						"min_in_pps":data_res[6],
						"max_out_bps":data_res[7],
						"min_out_bps":data_res[8],
						"max_out_pps":data_res[9],
						"min_out_pps":data_res[10],
						"ave_in_bps":data_res[11],
						"ave_in_pps":data_res[12],
						"ave_out_bps":data_res[13],
						"ave_out_pps":data_res[14]
						}
					data_list.append(data_dict)
			else:
				pass#print("no data")
			data_dict={
				"code":200,
				"message":"success",
				"dataNum":list_num,
				"data":data_list
				}
			return data_dict
	if type1=='ingroup':
		con=sqlite3.connect(database_default.lag_db)
		c=con.cursor()
		c.execute("select interlist from ingroup where name ='%s'"%name)
		res_ingroup=c.fetchone()
		if res_ingroup:
			grouplist=json.loads(res_ingroup[0])
		else:
			grouplist=[]
		con.close()
	if type1=='outgroup':
		con=sqlite3.connect(database_default.lag_db)
		c=con.cursor()
		c.execute("select interlist from outgroup where name ='%s'"%name)
		res_outgroup=c.fetchone()
		if res_outgroup:
			grouplist=json.loads(res_outgroup[0])
		else:
			grouplist=[]
		con.close()
	op_start_group=''
	op_end_group=''
	if begin_time!='':
		op_start_group=" and time>='%s' "%begin_time
	if end_time!='':
		op_end_group=" and time<='%s'"%end_time
	con=sqlite3.connect(database_default.statistic_db)
	c=con.cursor()
	if grouplist!=[]:
		length_list=len(grouplist)
		if data1['scale']=='hour':
			for i in grouplist:
				op_group="select * from portdata where port ='%s'"%i
				if op_start_group!='' and op_end_group!='':
					op_group=op_group+op_start_group+op_end_group
				op_group_num="Select count(*) from (%s)"%op_group
				c.execute(op_group_num)
				list_num=c.fetchone()
				if list_num:
					list_num=list_num[0]
				else:
					list_num=0
				if all_num=='':
					op_limit=" limit %d offset %d "%(limit,(int(select_id)-1)*limit)
				elif all_num!='xlsx':
					if int(select_id)==1:
						num_page=0
					elif list_num<=48:
						num_page=0
					elif int(select_id)*24+12>=list_num:
						num_page=list_num-48
					else:
						num_page=int(select_id)*24-12
					op_limit=" limit %d offset %d "%(limit*2,num_page)
				else:
					op_limit=' '
				if begin_time=='' and end_time =='':
					op_group=op_group+" ORDER BY time DESC "
				else:
					op_group=op_group+" ORDER BY time ASC "
				c.execute(op_group+op_limit)
				res_statistic=c.fetchall()
				if num==0:
					if res_statistic:
						for data_res in res_statistic:
							data_dict={
								"time":str(data_res[0]),
								"drop_packets":data_res[2],
								"in_bps":data_res[3],
								"in_octets":data_res[4],
								"in_packets":data_res[5],
								"in_pps":data_res[6],
								"out_bps":data_res[7],
								"out_octets":data_res[8],
								"out_packets":data_res[9],
								"out_pps":data_res[10]
							}
							data_list.append(data_dict)
					else:
						pass#("no data")
					num=1
				else:
					if res_statistic:
						list_i=0
						for data_res in res_statistic:
							if data_list[list_i]["time"]==str(data_res[0]):
								data_list[list_i]["drop_packets"]+=data_res[2]
								data_list[list_i]["in_bps"]+=data_res[3]
								data_list[list_i]["in_octets"]+=data_res[4]
								data_list[list_i]["in_packets"]+=data_res[5]
								data_list[list_i]["in_pps"]+=data_res[6]
								data_list[list_i]["out_bps"]+=data_res[7]
								data_list[list_i]["out_octets"]+=data_res[8]
								data_list[list_i]["out_packets"]+=data_res[9]
								data_list[list_i]["out_pps"]+=data_res[10]
								list_i+=1
							else:
								pass
					else:
						pass#print("no data")
			for res in data_list:
				res["in_bps"]=int(res["in_bps"])/length_list
				res["in_pps"]=int(res["in_pps"])/length_list
				res["out_bps"]=int(res["out_bps"])/length_list
				res["out_pps"]=int(res["out_pps"])/length_list
		else:
			for i in grouplist:
				op_db="Select * from portdata_day where port ='%s'"%i
				if begin_time!='':
					op_start1=" and time>='%s'"%begin_time
					op_db=op_db+op_start1
				if begin_time!='':
					op_end1=" and time<='%s' "%end_time
					op_db=op_db+op_end1
				op_num="Select count(*) from (%s)"%op_db
				con=sqlite3.connect(database_default.statistic_db)
				c=con.cursor()
				c.execute(op_num)
				res=c.fetchone()
				if res:
					list_num=res[0]
				else:
					pass
				if begin_time=='' and end_time =='':
					op_db=op_db+" ORDER BY time DESC "
				else:
					op_db=op_db+" ORDER BY time ASC "
				c.execute(op_db)
				res_statistic_day=c.fetchall()
				if num_group==0:
					list_group_i=0
					if res_statistic_day:
						for data_res in res_statistic_day:
							data_dict={
								"time":str(data_res[0])[0:10],
								"max_in_bps":data_res[3],
								"min_in_bps":data_res[4],
								"max_in_pps":data_res[5],
								"min_in_pps":data_res[6],
								"max_out_bps":data_res[7],
								"min_out_bps":data_res[8],
								"max_out_pps":data_res[9],
								"min_out_pps":data_res[10],
								"ave_in_bps":int(data_res[11]),
								"ave_in_pps":int(data_res[12]),
								"ave_out_bps":int(data_res[13]),
								"ave_out_pps":int(data_res[14])
								}
							data_list.append(data_dict)
					else:
						pass#print("no data")
					num_group=1
				else:
					if res_statistic_day:
						list_group_i=0
						for data_res in res_statistic_day:
							if data_list[list_group_i]["time"]==str(data_res[0])[0:10]:
								if data_list[list_group_i]["max_in_bps"]<data_res[3]:
									data_list[list_group_i]["max_in_bps"]=data_res[3]
								if data_list[list_group_i]["min_in_bps"]>data_res[4]:
									data_list[list_group_i]["min_in_bps"]=data_res[4]
								if data_list[list_group_i]["max_in_pps"]<data_res[5]:
									data_list[list_group_i]["max_in_pps"]=data_res[5]
								if data_list[list_group_i]["min_in_pps"]>data_res[6]:
									data_list[list_group_i]["min_in_pps"]=data_res[6]
								if data_list[list_group_i]["max_out_bps"]<data_res[7]:
									data_list[list_group_i]["max_out_bps"]=data_res[7]
								if data_list[list_group_i]["min_out_bps"]>data_res[8]:
									data_list[list_group_i]["min_out_bps"]=data_res[8]
								if data_list[list_group_i]["max_out_pps"]<data_res[9]:
									data_list[list_group_i]["max_out_pps"]=data_res[9]
								if data_list[list_group_i]["min_out_pps"]>data_res[10]:
									data_list[list_group_i]["min_out_pps"]=data_res[10]
								data_list[list_group_i]["ave_in_bps"]=data_list[list_group_i]["ave_in_bps"]+data_res[11]
								data_list[list_group_i]["ave_in_pps"]=data_list[list_group_i]["ave_in_pps"]+data_res[12]
								data_list[list_group_i]["ave_out_bps"]=data_list[list_group_i]["ave_out_bps"]+data_res[13]
								data_list[list_group_i]["ave_out_pps"]=data_list[list_group_i]["ave_out_pps"]+data_res[14]
								list_group_i+=1
			if list_group_i!=1 and list_group_i!=0:
				for num_list in range(list_group_i):
					data_list[num_list]["ave_in_bps"]=data_list[num_list]["ave_in_bps"]/length_list
					data_list[num_list]["ave_in_pps"]=data_list[num_list]["ave_in_pps"]/length_list
					data_list[num_list]["ave_out_bps"]=data_list[num_list]["ave_out_bps"]/length_list
					data_list[num_list]["ave_out_pps"]=data_list[num_list]["ave_out_pps"]/length_list
				
	return {"status_code":200,"dataNum":list_num,"message":"successd","data":data_list}
def write_statistic_data():
		while(True):
			time.sleep(20)
			time_list=databasetime.GetStatisticTime()
			time_str=time_list[0]
			time.sleep(int(time_str))
			insert_statistic_data()



def get_real_time_data(type1,data1):
	now_time=datetime.datetime.now()
	time_db=now_time.strftime("%Y-%m-%d %H:%M:%S")
	name=data1['object']
	if type1=='port':
		data1=json.loads(RestApiLogin.r.get(url=dataconfig.stat_url+"/"+name,verify=False).text)
		data1=data1[name]
		data1['time']=time_db
		list1=[data1]
	else:
		if type1=='ingroup':
			select_key='ingroup'
		elif type1=='outgroup':
			select_key='outgroup'
		con=sqlite3.connect(database_default.lag_db)
		c=con.cursor()
		c.execute("select interlist from %s where name ='%s'"%(select_key,name))
		res_group=c.fetchone()
		if res_group:
			grouplist=json.loads(res_group[0])
		else:
			grouplist=[]
		con.close()
		real_time_dict={
			"drop_packets":0,
			"in_bps":0,
			"in_octets":0,
			"in_packets":0,
			"in_pps":0,
			"out_bps":0,
			"out_octets":0,
			"out_packets":0,
			"out_pps":0
		}
		list_lenth=0
		num=0
		if grouplist!=[]:
			list_lenth=len(grouplist)
			for i in grouplist:
				num+=1
				data_dict=json.loads(RestApiLogin.r.get(url=dataconfig.stat_url+"/"+i,verify=False).text)
				data1=data_dict[i]
				for k,v in data1.items():
					if k in real_time_dict.keys():
						real_time_dict[k] += v
		real_time_dict['time']=time_db
		if list_lenth!=0:
			real_time_dict['in_bps']=real_time_dict['in_bps']/num
			real_time_dict['in_pps']=real_time_dict['in_pps']/num
			real_time_dict['out_bps']=real_time_dict['out_bps']/num
			real_time_dict['out_pps']=real_time_dict['out_pps']/num
		list1=[real_time_dict]
	return {"status_code":200,"dataNum":1,"message":"successd","data":list1}




def get_statistic_group():
	con=sqlite3.connect(database_default.lag_db)
	c=con.cursor()
	outgroup=[]
	ingroup=[]
	c.execute("select name from outgroup where lagid not in (1001) ")
	res_outgroup=c.fetchall()
	if res_outgroup:
		for i in res_outgroup:
			outgroup.append(i[0])
	c.execute("select name from ingroup")
	res_ingroup=c.fetchall()
	if res_ingroup:
		for i in res_ingroup:
			ingroup.append(i[0])
	data={"ingroup":ingroup,"outgroup":outgroup}
	return data
if __name__ == "__main__":
	data1={
		"object": "test1",
		"time": ["2019/01/01 04:00","2019/01/02 10:00"],
		"scale": "day",
		"page": 1
		}
	#print(get_statistic_data('ingroup',data1))