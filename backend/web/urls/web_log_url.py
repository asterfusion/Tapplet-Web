import sys
sys.path.append('./web/service/')
import LogHandler

web_log_url = [
	(r"/api/log/getWaringLog", LogHandler.GetWaringLogHandler),
    (r"/api/log/getSysLog",LogHandler.GetSystemLogHandler),
	(r"/api/log/getHomeWaringLog",LogHandler.GetWaringLogHandler),
	(r"/api/log/export",LogHandler.GetLogExcelHandler),
	]
