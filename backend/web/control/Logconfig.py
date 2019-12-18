#!/usr/bin/python3
import logging
import sqlite3
import json
import sys
sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
#sys.path.append('./')
#sys.path.append('../database/')
#sys.path.append('../config/')
import dataconfig
import permiss
import database_default
import data_operation
import datetime
import xlsxwriter
import gettext 
from tornado.concurrent import run_on_executor
Web_log = logging.getLogger("tornado.web")
Web_log.setLevel(logging.DEBUG)
handler = logging.handlers.RotatingFileHandler('./data/Web_request.log', maxBytes=5000000, backupCount=1)
#handler = logging.FileHandler('/root/Web.log', "a")
format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setLevel(logging.DEBUG)
handler.setFormatter(format)
#5242880
#5000000
Web_log.addHandler(handler)
trans = gettext.translation('lang','./data/language', languages=["en"])
_ = trans.gettext



op_db_all='Select * from system_log'

LogData_pass='./data/app_data/'


def write_xlsx_data():
	list_excel=[]
	con = sqlite3.connect(database_default.Log_db)
	c=con.cursor()
	c.execute(op_db_all)
	res=c.fetchall()
	con.close()
	if res:
		for i in res:
			i[0].encode('utf-8').decode('unicode_escape')
			i[1].encode('utf-8').decode('unicode_escape')
			i[2].encode('utf-8').decode('unicode_escape')
			data_excel=[i[0],i[1],i[2],i[3],i[4],i[5],str(i[6])]
			list_excel.append(data_excel)
	else:
		pass
	write_xlsx(list_excel)

def write_xlsx(data_log):
	workbook = xlsxwriter.Workbook(LogData_pass+'LogData.xlsx')
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
	worksheet = workbook.add_worksheet()
	if len(data_log)!=0:
		data=['username','module','operate','ip_address','date-time','data','result']
		row=1
		col=0
		for n in range(7):
			worksheet.write(0,col+n,data[n],ItemStyle_tatol)	
		for i in data_log:
			for n in range(7):
				if n==0 or n==1 or n==2 or n==5:
					i[n].encode('utf-8').decode('unicode_escape')
				else:
					pass
				worksheet.write(row,col+n,i[n],ItemStyle_data)	
			row+=1
	else:
		worksheet.write(0,0,'')	
	workbook.close()
@run_on_executor
def Write_Sys_Log(self,username,module,operate,ip_address,data_re,result):
	now_time = datetime.datetime.now()#+datetime.timedelta(hours=dataconfig.time_set_hours,minutes=dataconfig.time_set_min)
	time_db=now_time.strftime("%Y-%m-%d %H:%M:%S")
	english=''
	if operate=='保存配置':
		english="Save Configuration"
	if operate=='复位配置':
		english="Reset Configuration"
	if operate=="ip分片配置修改":
		english="Replace Configuration: ip_reassembly"
	if operate=="tcp乱序配置修改":
		english="Replace Configuration: tcp_reassembly"
	if operate=="KeyWord配置修改":
		english="Replace Configuration: keyword"
	if operate=="去重配置修改":
		english="Replace Configuration: deduplication"
	if operate=="未知配置修改":
		english="Replace Configuration: Unknown"
	if operate=='主机名修改':
		english='Replace Configuration: Hostname'
	if operate=="导入配置":
		english="Import Configuration"
	if operate=="导出配置":
		english="Export Configuration"
	if operate=="时区配置":
		english="Replace Configuration：Time Zone"
	if operate=="导出日志":
		english="Export Log"
	if operate=="添加角色":
		english="Insert Role"
	if operate=="更新角色":
		english="Update Role"
	if operate=="删除角色":
		english="Delete Role"
	if operate=="修改端口属性":
		english="Replace Configuration：Port"
	if operate=="登录错误":
		english="Wrong Login request"
	if operate=="添加用户":
		english="Insert User"
	if operate=="修改用户":
		english="Update User"
	if operate=="删除用户":
		english="Delete User"
	if operate=="用户登录":
		english="User Login"
	if operate=="用户退出":
		english="User Logout"
	if operate=="添加规则组":
		english="Insert Rulegroup"
	if operate=="删除规则组":
		english="Delete Rulegroup"
	if operate=="修改规则组":
		english="Update Rulegroup"
	if operate=="创建出端口组":
		english="Insert Outgroup"
	if operate=="更新出端口组":
		english="Update Outgroup"
	if operate=="删除出端口组":
		english="Delete Outgroup"
	if operate=="创建入端口组":
		english="Insert Ingroup"
	if operate=="更新入端口组":
		english="Update Ingroup"
	if operate=="删除入端口组":
		english="Delete Ingroup"
	if operate=="添加规则":
		english="Insert Rule"
	if operate=="删除规则":
		english="Delete Rule"
	sqlite_t=(username,module,operate,ip_address,time_db,data_re,result,english)
	con = sqlite3.connect(database_default.Log_db)
	c=con.cursor()
	c.execute("INSERT INTO system_log (username,module,operate,ip_address,time,data,result,english) VALUES(?,?,?,?,?,?,?,?)",sqlite_t)
	con.commit()
	con.close()
	return True

def Get_Sys_Log(languages,pagesize,page,sort_field,sort_order,username,module,operate,ip_address,start_time,end_time):
	global op_db_all
	list_get=[]
	list_excel=[]
	if sort_field=='':
		sort_field='time'
	if sort_order=='':
		sort_order='descend'
	if pagesize=='':
		pagesize='10'
	if page=='':
		page='1'
	con = sqlite3.connect(database_default.Log_db)
	c=con.cursor()
	op_username=""
	op_module=""
	op_operate=""
	op_ip=""
	op_db=""
	if start_time!='':
		start_time=start_time+" 00:00:00"
		op_start1="Select * from system_log where time >= '%s'"%start_time
		op_db=op_db+op_start1
	if end_time!='':
		end_time=end_time+" 23:59:59"
		op_end1="Select * from system_log where time <= '%s'"%end_time
		op_end_and=" and time <= '%s'"%end_time
		if op_db!="":
			op_db=op_db+op_end_and
		else:
			op_db=op_db+op_end1
	if username!='':
		op_username="Select * from system_log where username like '%%%s%%'"%username
		op_username_and=" and username like '%%%s%%'"%username
		if op_db!="":
			op_db=op_db+op_username_and
		else:
			op_db=op_db+op_username
	if module!='':
		op_module="Select * from system_log where module like '%%%s%%'"%module
		op_module_and=" and module like '%%%s%%'"%module
		if op_db!="":
			op_db=op_db+op_module_and
		else:
			op_db=op_db+op_module
	if operate!='':
		if languages=='en-US':
			name_op='english'
		else:
			name_op='operate'
		op_operate="Select * from system_log where %s like '%%%s%%'"%(name_op,operate)
		op_operate_and=" and %s like '%%%s%%'"%(name_op,operate)
		if op_db!="":
			op_db=op_db+op_operate_and
		else:
			op_db=op_db+op_operate
	if ip_address!='':
		op_ip="Select * from system_log where ip_address like '%%%s%%'"%ip_address
		op_ip_and=" and ip_address like '%%%s%%'"%ip_address
		if op_db!="":
			op_db=op_db+' INTERSECT '+op_ip
		else:
			op_db=op_db+op_ip
	if op_db=='':
		op_db="Select * from system_log"
	op_num="Select count(*) from (%s)"%op_db
	c.execute(op_num)
	res=c.fetchone()
	if res:
		list_num=res[0]
	else:
		pass
	op_db_all=op_db
	if sort_field!='' and sort_order!='':
		if sort_order=='ascend':
			sort_order='ASC'
		elif sort_order=='descend':
			sort_order='DESC'
		op_db=op_db+" ORDER BY %s %s "%(sort_field,sort_order)
	if pagesize!='' and page!='':
		op_db=op_db+" limit %d offset %d "%(int(pagesize),(int(page)-1)*int(pagesize))
	c.execute(op_db)
	res=c.fetchall()
	if res:
		for i in res:
			if languages=='en-US':
				dict_get={"username":i[0],"module":_(i[1]),"operate":_(i[2]),"ip_address":i[3],"time":str(i[4])}
			else:
				dict_get={"username":i[0],"module":(i[1]),"operate":(i[2]),"ip_address":i[3],"time":str(i[4])}
			list_get.append(dict_get)
	data_for_web={"code":200,"message":"success","total_count":list_num,"data":list_get}
	return data_for_web

#Write_Sys_Log('admin','登录','用户登录','192.168.1.1','asdzxc',200)  （用户名，模组，操作，ip地址，数据，结果）
#print(Get_Sys_Log('10','1','','','user','','','','',''))		#(页面大小，页数，排序字符串('a,b,c')，排序逻辑，用户名，模组，操作，ip地址，开始时间，结束时间)