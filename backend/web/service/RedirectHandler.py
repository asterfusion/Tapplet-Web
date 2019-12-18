#!/usr/bin/python3
from tornado.web import url,RequestHandler
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
class RedirectHandler(RequestHandler):
    def get(self, *args, **kwargs):
        self.redirect("/nw/")