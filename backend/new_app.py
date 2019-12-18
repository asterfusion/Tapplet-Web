from tornado.web import Application
from web.urls.url import urls
import os

static_path = os.path.dirname(os.path.abspath("__file__"))

class WebApplication(Application):
    def __init__(self):
        self._url_map = self._get_url_map()
        Application.__init__(self, self._url_map, static_path = os.path.join(static_path, "static"), cookie_secret="SF_REST_API")

    def _get_url_map(self):
        url_map_list = urls().url_list
        return url_map_list

