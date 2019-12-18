#!/usr/bin/python3
import json


def ByteToJson(jsonbyte):				#byte类型转JSON类型
		jsonstr=jsonbyte.decode('utf8')
		data=json.loads(jsonstr)
		return data


def ByteToStr(bstr):				#byte类型转字符串类型
		str1=bstr.decode('utf8')
		return str1
