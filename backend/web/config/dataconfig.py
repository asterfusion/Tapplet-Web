#!/usr/bin/python3
from tornado.concurrent import run_on_executor
import configparser
import re
import subprocess
from os import  system
me_ip='https://localhost'
action_url=me_ip+'/rest/v1/actions'
rule_url=me_ip+'/rest/v1/acl/config'
interface_url=me_ip+'/rest/v1/interfaces/config'
login_url=me_ip+'/rest/v1/login'
logout_url=me_ip+'/rest/v1/logout'
login_data={'username':'admin','password':'admin'}
stat_url=me_ip+'/rest/v1/interfaces/stat'
status_url=me_ip+'/rest/v1/interfaces/status'
systeminfo_url=me_ip+'/rest/v1/system/info'
systemusing_url=me_ip+'/rest/v1/system/status'
reset_url=me_ip+'/rest/v1/system/config'
common_config=me_ip+'/rest/v1/'
statistic_url=me_ip+'/rest/v1/interfaces/stat'
interface_phy_url=me_ip+'/rest/v1/interfaces/phy_info'
system_more_info_url=me_ip+'/rest/v1/mgmt'
save_all_config_url=me_ip+'/rest/v1/system/config/sync'
hostname_url=me_ip+'/rest/v1/hostname'
version_url=me_ip+'/rest/v1/version'
acl_sync=me_ip+'/rest/v1/acl/sync'
fusionnos_url=me_ip+'/rest/v1/system/fusionnos'
time_set_hours=8
time_set_min=0
id_of_world=''

def exec_success(cmd):
	status = system(cmd)
	if status == 0:
		return True
	return False

world_time={	
"1":-12,
"2":-11,
"3":-10,
"4":-10,
"5":"Pacific/Marquesas",
"6":-9,
"7":-9,
"8":-8,
"9":-8,
"10":-8,
"11":-7,
"12":-7,
"13":-7,
"14":"Pacific/Easter",
"15":"America/Mexico_City",
"16":-6,
"17":-6,
"18":"America/Bogota",
"19":-5,
"20":"America/Havana",
"21":-5,
"22":-5,
"23":"America/Havana",
"24":"America/Indiana/Marengo",
"25":-4,
"26":"Ameriac/Caracas",
"27":"Ameriac/Cuiaba",
"28":"Ameriac/Manaus",
"29":"Ameriac/Santiago",
"30":"Ameriac/Asuncion",
"32":"America/Araguaina",
"33":-3,
"34":"America/Argentina/Buenos_Aires",
"35":-3,
"36":"America/Cayenne",
"37":"America/Montevideo",
"38":"America/Punta_Arenas",
"39":"America/El_Salvador",
"40":"America/Miquelon",
"41":-2,
"42":"Atlantic/Cape_Verde",
"43":"Atlantic/Azores",
"44":0,
"45":"Europe/London",
"46":"Africa/Monrovia",
"47":"Africa/Sao_Tome",
"48":"Europe/Amsterdam",
"49":"Europe/Belgrade",
"50":"Europe/Brussels",
"51":"Europe/Sarajevo",
"52":1,
"53":"Asia/Amman",
"54":"Asia/Beirut",
"55":"Asia/Damascus",
"56":"Asia/Hebron",
"57":"Africa/Harare",
"58":"Europe/Helsinki",
"59":"Asia/Jerusalem",
"60":"Asia/Jerusalem",
"61":"Asia/Gaza",
"62":"Africa/Khartoum",
"63":"Europe/Kaliningrad",
"64":"Africa/Windhoek",
"65":"Europe/Athens",
"66":"Africa/Tripoli",
"67":"Asia/Baghdad",
"68":"Kuwait",
"69":"Europe/Minsk",
"70":"Europe/Moscow",
"71":"Africa/Nairobi",
"72":"Europe/Istanbul",
"73":"Asia/Tehran",
"74":"Asia/Muscat",
"75":"Europe/Ulyanovsk",
"76":"Asia/Yerevan",
"77":"Asia/Baku",
"78":"Asia/Tbilisi",
"79":"Europe/Volgograd",
"80":"Indian/Mauritius",
"81":"Europe/Saratov",
"82":"Europe/Samara",
"83":"Asia/Kabul",
"84":"Asia/Tashkent",
"85":"Asia/Yekaterinburg",
"86":"Asia/Qyzylorda",
"87":"Asia/Karachi",
"88":"Asia/Kolkata",
"90":"Asia/Kathmandu",
"91":6,
"92":"Asia/Dhaka",
"93":"Asia/Omsk",
"94":"Asia/Yangon",
"95":"Asia/Bangkok",
"96":"Asia/Hovd",
"97": "Asia/Krasnoyarsk",
"98": "Asia/Bangkok",
"99": "Asia/Tomsk",
"100":"Asia/Novosibirsk",
"101":"Asia/Shanghai",
"102":"Asia/Kuala_Lumpur",
"103":"Australia/Perth",
"104":"Asia/Taipei",
"105":"Asia/Ulaanbaatar",
"106":"Asia/Irkutsk",
"107":"Australia/Eucla",
"108":"Asia/Chita",
"109":"Asia/Tokyo",
"110":"Asia/Pyongyang",
"111":"Asia/Seoul",
"112":9,
"113":"Australia/Adelaide",
"114":"Australia/Darwin",
"115":"Australia/Brisbane",
"116":"Asia/Vladivostok",
"117":"Pacific/Port_Moresby",
"118":"Australia/Hobart",
"119":"Australia/Sydney",
"120":"Australia/Lord_Howe",
"121":"Pacific/Bougainville",
"122":"Asia/Magadan",
"123":"Pacific/Norfolk",
"124":11,
"125":"Asia/Sakhalin",
"126":11,
"127":"Asia/Anadyr",
"128":"Pacific/Auckland",
"129":"Pacific/Fiji",
"130":12,
"131":"Pacific/Chatham",
"132":13,
"133":13,
"134":13,
"135":"Pacific/Kiritimati"
}

@run_on_executor
def do_time_set(self,id1):
	id1=int(id1)
	try:
		time_str=world_time[str(id1)]
	except:
		time_str=0
	if type(time_str)!=int:
		exec_success("timedatectl set-timezone %s"%(time_str))
		return True
	else:
		return False

def do_time_set_static(id1):
	id1=int(id1)
	try:
		time_str=world_time[str(id1)]
	except:
		time_str=0
	if type(time_str)!=int:
		exec_success("timedatectl set-timezone %s"%(time_str))
		return True
	else:
		return False


def getCfgConfig():
	global id_of_world
	output = subprocess.Popen(["timedatectl"], stdout=subprocess.PIPE).communicate()[0].decode("gbk") 
	timezone = re.findall(r'Time zone: (.\S*) ',output)[0]
	for key,value in world_time.items():
		if value==timezone:
			id_of_world=key
			id_of_world=int(key)
		else:
			pass
	if id_of_world=="":
		do_time_set_static('101')
	return True


getCfgConfig()



"""
config={
	"name":"test2",
    "lagid":1,
    "description":"ok",
    "interfaces": ["X1","X2"],
    "load_balance_mode": "wrr",
    "load_balance_weight": "2:1",	     
    "additional_actions": {
		"time_stamping": {
		"switch":1
		},
	"gre_encapsulation":{
		"switch":1,
		"gre_dmac" : "11:22:33:44:55:66",
		"gre_dip" : "192.168.1.100"
		},
	"slice":{
		"switch":1,
		"slice_bytes": 100,
		"slice_flag_update": 1
		},
	"remove_tunnel_header_vlan": {
		"switch":1,
		"vlan_layers": [1,2]
		} 
	} 
}
{"1":{
	"basis_actions":{
		"type":"load_balance"
		"interfaces": ["X1","X2"],
		"load_balance_mode": "wrr",
		"load_balance_weight": "2:1"
		}	     
    "additional_actions": {
		"time_stamping": {
		"switch":1
		},
	"gre_encapsulation":{
		"switch":1,
		"gre_dmac" : "11:22:33:44:55:66",
		"gre_dip" : "192.168.1.100"
		},
	"slice":{
		"switch":1,
		"slice_bytes": 100,
		"slice_flag_update": 1
		},
	"remove_tunnel_header_vlan": {
		"switch":1,
		"vlan_layers": [1,2]
		}}}}	
action_insert(config)



{'type': 'load_balance',
 'interlist': ['X1', 'X2', 'X3', 'X4'], 
 'loadbalance': {'mode': 'wrr', 'weight': '1:1:1:1'}, 
 'additional_actions': {'gre_encapsulation': {'switch': 0, 'gre_dmac': '', 'gre_dip': ''}}, 
 'lagid': 3, 
 'name': 'aaa', 
 'description': 'aa'
 }

{
    "X1": {
        "deduplication_enable": 0,
        "ingress_config": {
            "default_action_id": 0,
            "rule_group": "1",
            "rule_to_action": {},
            "tuple_mode": 0
        }
    }
}
"""