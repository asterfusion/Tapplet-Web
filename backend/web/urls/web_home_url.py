import sys
sys.path.append('./web/service/')
import InterfaceHandler
web_home_url = [
	(r"/api/home/AllStatus",InterfaceHandler.ListStatusHandler),
	(r"/api/home/StatList",InterfaceHandler.ListStatHandler),
	(r"/api/home/StatusTrend",InterfaceHandler.ListStatusTreadHandler),
	(r"/api/home/SystemInfo",InterfaceHandler.ListSystemInfoHandler),
	(r"/api/home/SystemUsing",InterfaceHandler.ListSystemUsingHandler),
	(r"/api/home/GetInterfacesNum",InterfaceHandler.GetInterfaceNumHandler)
	]
