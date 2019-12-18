from web.urls.user_permiss_url import user_permiss_url
from web.urls.static_url import static_url
import sys
from web.urls.web_home_url import web_home_url
from web.urls.web_policy_url import web_policy_url
from web.urls.web_common_url import web_common_url
from web.urls.web_log_url import web_log_url
from web.urls.web_statistic_url import web_statistic_url
sys.path.append('./web/control/')
from Logconfig import Web_log


web_activator_urls = (
            user_permiss_url,
            static_url,
            web_home_url,
            web_policy_url,
            web_common_url,
            web_log_url,
            web_statistic_url
            )

class urls:
    def __new__(cls, *args, **kw):
        cls.instance = super(urls, cls).__new__(cls, *args, **kw)
        return cls.instance

    def __init__(self):
        self.url_list = []
        self.append_url_map(web_activator_urls)
        Web_log.debug("activator_urls: {0}".format(str(self.url_list)))

    def append_url_map(self, args):
        for url in args:
            if isinstance(url, list):
                self.url_list.extend(url)
                continue
            if isinstance(url, tuple):
                for url1 in url:
                    if isinstance(url1, list):
                        self.url_list.extend(url1)
                    else:
                        Web_log.debug("error url_map as {0}".format(str(url)))
            else:
                Web_log.debug("error url_map as {0}".format(str(url)))
    

