import sys
sys.path.append('./web/service/')
import StatisticHandler

web_statistic_url = [
	(r"/api/statistics/queryStatistics", StatisticHandler.GetStatisticHandler),
	(r"/api/statistics/queryTrend",StatisticHandler.GetStatisticAllHandler),
	(r"/api/statistics/queryGroupName",StatisticHandler.GetStatisticGroupHandler),
	(r"/api/statistics/export",StatisticHandler.GetStatisticExcelHandler),
	]
