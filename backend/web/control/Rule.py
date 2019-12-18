import Action_to_rule
import RestApiLogin
import database_default
import data_operation
import dataconfig
from tornado.concurrent import run_on_executor
import urllib3
import tornado.autoreload
import requests
from concurrent.futures import ThreadPoolExecutor
import time
import threading
#!/usr/bin/python3
import asyncio
import datetime
import json
import sqlite3
import sys
import copy


sys.path.append('./web/control/')
sys.path.append('./web/database/')
sys.path.append('./web/config/')
Chongfu=0

urllib3.disable_warnings()


def rulegroup_write(data):
    global Chongfu
    Chongfu=0
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("Select * from rulegroup where ingroupname='%s' and outgroupname='%s'"%(data['ingroupname'],data['outgroupname']))
    insert_try=c.fetchone()
    if insert_try:
        return False
    if "description" not in data:
        data["description"] = ''
    else:
        pass
    try:
        c.execute("INSERT INTO rulegroup (name,ingroupname,outgroupname,description,isEmpty) VALUES('%s','%s','%s','%s',%d)" %
                  (data["rulegroupname"], data["ingroupname"], data["outgroupname"], data["description"],0))
        con.commit()
    except:
        return False
    str1 = "rule"
    if data[str1] != []:
        res_data1=rule_write(data)
        res_rule = res_data1['data']
        if res_data1['message']=='re':
            Chongfu=1
        if (len(data["rule"]) != len(res_rule)):
            c.execute("select description from rule where name = 'None'")
            db_res = c.fetchone()
            list1 = json.loads(db_res[0])
            for ruleid in res_rule:
                RestApiLogin.r.delete(url=dataconfig.rule_url+'/group_1/%d' % ruleid, verify=False)
                c.execute("Delete from rule where ruleid=%d" % ruleid)
                list1.append(ruleid)
            list1 = json.dumps(list1)
            c.execute("UPDATE rule set description='%s' where name='None'" % list1)
            c.execute("DELETE from rulegroup where name='%s'"%data["rulegroupname"])
            con.commit()
            con.close()
            return False
        else:
            pass
    else:
        c.execute("UPDATE rulegroup set isEmpty=1 where name ='%s'"%data["rulegroupname"])
    con.commit()
    con.close()
    return True

def only_delete_rule(res_rule):
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("select description from rule where name = 'None'")
    db_res = c.fetchone()
    list1 = json.loads(db_res[0])
    for ruleid in res_rule:
        RestApiLogin.r.delete(url=dataconfig.rule_url+'/group_1/%d' % ruleid, verify=False)
        c.execute("Delete from rule where ruleid=%d" % ruleid)
        list1.append(ruleid)
    list1 = json.dumps(list1)
    c.execute("UPDATE rule set description='%s' where name='None'" % list1)
    con.commit()
    con.close()


def rule_write(data):
    list_ruleid = []
    groupid = "group_1"
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("select groupid,description from rule where name = 'None'")
    db_result = c.fetchone()
    list1 = json.loads(db_result[1])
    rule_test = int(db_result[0])
    for i in data["rule"]:
        data_q=copy.deepcopy(i)
        rule_num = 0
        if (len(list1) == 0):
            ruleid = rule_test
            c.execute("UPDATE rule set groupid='%s' where name='None'" % str(ruleid+1))
            rule_test += 1
        else:
            ruleid = list1[0]
            del list1[0]
            jsonlist = json.dumps(list1)
            c.execute("UPDATE rule set description='%s' where name='None'" % jsonlist)
        if i["action"] == '0':
            rule_num = 1
        del i["action"]
        rule_type = i["rule_type"]
        del i["rule_type"]
        rule_cfg = i
        if  rule_type == 'tuple4':
            if 'dip' in rule_cfg :
                if rule_cfg['dip']!=0:
                    str1 = rule_cfg["dip"]
                    list1_cfg = (str1.split('/'))
                    rule_cfg["dip"]=list1_cfg[0]
                    rule_cfg["dip_mask"]=int(list1_cfg[1])
                else:
                    rule_cfg['dip']='0.0.0.0'
                    rule_cfg['dip_mask']=0
            if 'sip' in rule_cfg :
                if rule_cfg['sip']!=0:
                    str2 = rule_cfg["sip"]
                    list2 = (str2.split('/'))
                    rule_cfg["sip"]=list2[0]
                    rule_cfg["sip_mask"]=int(list2[1])
                else:
                    rule_cfg["sip"]='0.0.0.0'
                    rule_cfg['sip_mask']=0
            else:
                pass
        else:
            pass
        if rule_type == 'tuple6':
            if 'dip' in rule_cfg :
                if rule_cfg['dip']!=0:
                    str1 = rule_cfg["dip"]
                    list1_cfg = (str1.split('/'))
                    rule_cfg["dip"]=list1_cfg[0]
                    rule_cfg["dip_mask"]=int(list1_cfg[1])
                else:
                    rule_cfg['dip']='00:00:00:00:00:00:00:00'
                    rule_cfg['dip_mask']=0
            if 'sip' in rule_cfg :
                if rule_cfg['sip']!=0:
                    str2 = rule_cfg["sip"]
                    list2 = (str2.split('/'))
                    rule_cfg["sip"]=list2[0]
                    rule_cfg["sip_mask"]=int(list2[1])
                else:
                    rule_cfg["sip"]='00:00:00:00:00:00:00:00'
                    rule_cfg['sip_mask']=0
            else:
                pass
        else:
            pass
        data_rule = {"rule_type": rule_type, "rule_cfg": rule_cfg}
        data_to_rest = {groupid: {str(ruleid): data_rule}}
        re = RestApiLogin.r.post(url=dataconfig.rule_url, data=json.dumps(data_to_rest), verify=False)  #
        #print(re,json.dumps(data_to_rest))
        if (re.status_code == 201):
            if rule_num == 1:
                c.execute("INSERT INTO rule (name,ruleid,groupid,description,data) VALUES('%s',%d,'%s','%s','%s')" %
                          (data["rulegroupname"], ruleid, groupid, "drop",json.dumps(data_q)))
            else:
                c.execute("INSERT INTO rule (name,ruleid,groupid,description,data) VALUES('%s',%d,'%s','%s','%s')" %
                          (data["rulegroupname"], ruleid, groupid,"True",json.dumps(data_q)))
            list_ruleid.append(ruleid)
        elif re.status_code == 500:
            con.close()
            return {'data':list_ruleid,'message':'re'}
        else:
            con.close()
            return {'data':list_ruleid,'message':'wrong'}
    c.execute("Select * from rule where name='%s' and description <>'drop'"%data['rulegroupname'])
    res_isEmpty=c.fetchall()
    if res_isEmpty:
        c.execute("UPDATE rulegroup set isEmpty=0 where name ='%s'"%data["rulegroupname"])
    else:
        c.execute("UPDATE rulegroup set isEmpty=1 where name ='%s'"%data["rulegroupname"])
    con.commit()
    con.close()
    return {'data':list_ruleid,'message':'ok'}


def rule_des_update(data):
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("UPDATE rulegroup set description='%s' where name = '%s'" % (data['description'], data['rulegroupname']))
    con.commit()
    con.close()
    return True


def rulegroup_select(name):
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("select description,ingroupname,outgroupname from rulegroup where name = '%s'" % name)
    db_result = c.fetchone()
    if db_result:
        description = db_result[0]
        ingroupname = db_result[1]
        outgroupname = db_result[2]
        con.close()
        rule = rule_select(name)
        data = {"rulegroupname": name, "ingroupname": ingroupname,
                "outgroupname": outgroupname, "description": description, "rule": rule}
    else:
        str1 = "%s is not exist" % name
        return str1
    return data


def rulegroup_list():
    list1 = []
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("select name,ingroupname,outgroupname,isEmpty from rulegroup")
    db_result = c.fetchall()
    if db_result:
        for i in db_result:
            list1.append({"rulegroupname": i[0], "ingroupname": i[1], "outgroupname": i[2],"isEmpty":i[3]})
    return list1


def rule_select(name):
    ruledict = []
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    c.execute("select ruleid,groupid,description,data from rule where name = '%s'" % name)
    db_result = c.fetchall()
    if db_result:
        for row in db_result:
            ruleid = row[0]
            rule={}
            rule_data=json.loads(row[3])
            rule['rule_type']=rule_data['rule_type']
            rule['action']=rule_data['action']
            del rule_data['rule_type']
            del rule_data['action']
            rule['rule_cfg']=rule_data
            rule["ruleid"] = ruleid
            ruledict.append(rule)
    return ruledict


def rule_delete(name, id1=0):
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    if id1 == 0:
        c.execute("select ruleid from rule where name= '%s'" % name)
        res = c.fetchall()
        if res:
            for i in res:
                ruleid = i[0]
                re = RestApiLogin.r.delete(url=dataconfig.rule_url+'/group_1/%d' % ruleid, verify=False)
                if re.status_code == 204:
                    c.execute("Delete from rule where ruleid=%d" % ruleid)
                    c.execute("select description from rule where name = 'None'")
                    db_res = c.fetchone()
                    list1 = json.loads(db_res[0])
                    list1.append(ruleid)
                    list1 = json.dumps(list1)
                    c.execute("UPDATE rule set description='%s' where name='None'" % list1)
                else:
                    con.close()
                    return False
            con.commit()
            con.close()
            return True
        else:
            con.close()
            return True
    else:
        c.execute("select name,ingroupname,outgroupname from rulegroup where name= '%s'" % name)
        res1 = c.fetchone()
        ingroupname = res1[1]
        outgroupname = res1[2]
        Action_to_rule.remove_action_to_rule(ingroupname, outgroupname, id1)
        re = RestApiLogin.r.delete(url=dataconfig.rule_url+'/group_1/%d' % id1, verify=False)
        if re.status_code == 204:
            c.execute("Delete from rule where ruleid=%d" % id1)
            c.execute("select description from rule where name = 'None'")
            db_res = c.fetchone()
            list1 = json.loads(db_res[0])
            list1.append(id1)
            list1 = json.dumps(list1)
            c.execute("UPDATE rule set description='%s' where name='None'" % list1)
            c.execute("select * from rule where name='%s' and description <>'drop'"%name)
            isEmpty=c.fetchall()
            if isEmpty:
                c.execute("UPDATE rulegroup set isEmpty=0 where name ='%s'"%name)
            else:
                c.execute("UPDATE rulegroup set isEmpty=1 where name ='%s'"%name)
        else:
            con.close()
            return False
        con.commit()
        con.close()
        return True


def rulegroup_delete(name, inname='', outname=''):
    out_db_res_num=0
    con = sqlite3.connect(database_default.lag_db)
    c = con.cursor()
    if (inname != ''):
        c.execute("select name from rulegroup where ingroupname= '%s'" % inname)
        db_res = c.fetchone()
        if db_res:
            name = db_res[0]
        else:
            return True
    elif(outname != ''):
        c.execute("select name from rulegroup where outgroupname= '%s'" % outname)
        out_db_res = c.fetchall()
        if out_db_res:
            out_db_res_num=1
        else:
            return True
    else:
        pass
    if out_db_res_num==1:
        for i in out_db_res:
            name=i[0] 
            c.execute("select name,ingroupname,outgroupname from rulegroup where name= '%s'" % name)
            res = c.fetchone()
            if res:
                ingroupname = res[1]
                outgroupname = res[2]
                Action_to_rule.remove_action_to_rulegroup(ingroupname, outgroupname, name)
                res_rule = rule_delete(name)
                if res_rule:
                    c.execute("Delete from rulegroup where name='%s'" % name)
                    con.commit()
                else:
                    con.close()
                    return False
            else:
                return False
    else:
        c.execute("select name,ingroupname,outgroupname from rulegroup where name= '%s'" % name)
        res = c.fetchone()
        if res:
            ingroupname = res[1]
            outgroupname = res[2]
            Action_to_rule.remove_action_to_rulegroup(ingroupname, outgroupname, name)
            res_rule = rule_delete(name)
            if res_rule:
                c.execute("Delete from rulegroup where name='%s'" % name)
                con.commit()
                con.close()
                return True
            else:
                con.close()
                return False
        else:
            return False
    con.close()
    return True

@run_on_executor
def rule_sync(self):
    sync_data=[{"op": "replace","path": "/", "value": 1}]
    re = RestApiLogin.r.patch(url=dataconfig.acl_sync,data=json.dumps(sync_data),verify=False)
    if re.status_code==204:
        num_jump=0
        while(1):
            time.sleep(0.5)
            re1=RestApiLogin.r.get(url=dataconfig.acl_sync,verify=False)
            if json.loads(re1.text)['sync_status']=="sync ok":
                return True
            else:
                num_jump+=1
            if num_jump>600:
                return False
            else:
                pass
    else:
        return False

"""				
data2={
    "ingroupname":"xxx"
    "outgroupname":"xxx1"
    "rulegroupname":"test",
    "description":"i need data",
    "rule":[rule1,rule2,......]
}
rule1:
    {	"rule_id":"1"
        "rule_type":"tuple",
        "rule_cfg":
        { 
            "dip":"123.123.123.123",
            "dip_mask":24,
            "dport_max":210,
            "dport_min":210,
            "proto_max":17,
            "proto_min":17,
            "sip":"192.168.255.254",
            "sip_mask":24,
            "sport_max":4789,
            "sport_min":4789,
            "vlan_max":0,
            "vlan_min":0
        } 
    } 	
#ruleid_write(data2)
data1={
        "group_1": 
        { 
            "1": 
            { 
                "rule_type":"tuple",
                "rule_cfg":
                { 
                    "dip":"123.123.123.123",
                    "dip_mask":24,
                    "dport_max":210,
                    "dport_min":210,
                    "proto_max":17,
                    "proto_min":17,
                    "sip":"192.168.255.254",
                    "sip_mask":24,
                    "sport_max":4789,
                    "sport_min":4789,
                    "vlan_max":0,
                    "vlan_min":0
                } 
            } 
        } 
}
"""
