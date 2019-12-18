import os
import tornado.web

#from resource.static_handler import *
path = os.path.dirname(os.path.abspath("__file__"))
static_path = os.path.join(path, "../frontend/new_static")
static_url = [
        (r"/nw/(.*)",tornado.web.StaticFileHandler, {"path":static_path, "default_filename": "index.html"})
        ]
