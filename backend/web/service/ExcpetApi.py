import json

class APIException(Exception):
    status_code = 400
    status = 'wrong data'
    def __init__(self, detail=None): 
        self.detail = detail
    def __str__(self):
        error_json = {}
        error_json['message'] = self.detail
        error_json['status_code'] = self.status_code
        return json.dumps(error_json) 

class LoginFailed(APIException):
    status_code = 4011
    status = 'Please Login'

class PermissFailed(APIException):
    status_code = 401
    status = 'No permission'