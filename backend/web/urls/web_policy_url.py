import sys
sys.path.append('./web/service/')
import LagHandler
import RuleHandler
import ResetHandler
import Config_up_downHandler
web_policy_url = [
	(r"/api/policy/ListIngroup",LagHandler.ListIngroupHandler),
	(r"/api/policy/InsertIngroup",LagHandler.InsertIngroupHandler),
	(r"/api/policy/DeleteIngroup",LagHandler.DeleteIngroupHandler),
	(r"/api/policy/UpdateIngroup",LagHandler.UpdateIngroupHandler),
	(r"/api/policy/ListOutgroup",LagHandler.ListOutgroupHandler),
	(r"/api/policy/InsertOutgroup",LagHandler.InsertOutgroupHandler),
	(r"/api/policy/DeleteOutgroup",LagHandler.DeleteOutgroupHandler),
	(r"/api/policy/UpdateOutgroup",LagHandler.ReplaceOutgroupHandler),
	(r"/api/policy/ListRuleGroup",RuleHandler.ListRuleGroupHandler),
	(r"/api/policy/InsertRuleGroup",RuleHandler.InsertRuleGroupHandler),
	(r"/api/policy/DeleteRuleGroup",RuleHandler.DeleteRuleGroupHandler),
	(r"/api/policy/InsertRule",RuleHandler.InsertRuleHandler),
	(r"/api/policy/UpdatePort",LagHandler.UpdatePortHandler),
	(r"/api/policy/DeletePort",LagHandler.DeletePortHandler),
	(r"/api/policy/ResetPolicy",ResetHandler.ResetPolicyHandler),
	(r"/api/policy/SystemConfigHandler",Config_up_downHandler.SystemConfigHandler),
	(r"/api/policy/SystemTime",Config_up_downHandler.SystemTimeHandler),
	(r"/api/policy/getDefaultRuleInterface",LagHandler.getDefaultRuleInterfaceHandler),
	]
