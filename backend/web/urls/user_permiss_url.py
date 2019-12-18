import sys
sys.path.append('./web/service/')
import UserHandler 
import PermissHandler
import RedirectHandler
user_permiss_url = [
        (r"/api/UserLogin", UserHandler.LoginHandler),
    	(r"/api/UserList",UserHandler.ListHandler),
    	(r"/api/UserInsert",UserHandler.InsertHandler),
    	(r"/api/UserUpdate",UserHandler.UpdateHandler),
    	(r"/api/UserDelete",UserHandler.DeleteHandler),
    	(r"/api/PermissInsert", PermissHandler.InsertHandler),
    	(r"/api/PermissDelete",PermissHandler.DeleteHandler),
    	(r"/api/PermissList",PermissHandler.ListPHandler),
    	(r"/api/RoleList",PermissHandler.ListRHandler),
    	(r"/api/PermissUpdate",PermissHandler.UpdatePHandler),
    	(r"/api/PermissTable",PermissHandler.GetTableHandler),
    	(r"/api/PermissGet",PermissHandler.GetPermissHandler),
    	(r"/",RedirectHandler.RedirectHandler),
		(r"/api/Logout",UserHandler.LogoutHandler),
        ]
