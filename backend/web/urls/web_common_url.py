import sys
sys.path.append('./web/service/')
import Common_configHandler
import Config_up_downHandler
import AllConfigHandler
web_common_url = [
	(r"/api/common/VppConfig",Common_configHandler.PatchVppHandler),
	(r"/api/common/HostnameConfig",Common_configHandler.PatchHostNameHandler),
	(r"/api/system/SaveConfig",AllConfigHandler.SaveConfigHandler),
	(r"/api/system/ResetConfig",AllConfigHandler.ResetConfigHandler),
	(r"/api/common/SystemConfigTime",Config_up_downHandler.SystemTimeConfigHandler),
	]
