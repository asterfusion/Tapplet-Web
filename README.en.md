English | [简体中文](./README.md)

<h1 align="center">Asterfusion</h1>

## Functions
Tapplet-Web can configure and manage Tapplet through the Web, the functions are as follows
```
- Home
- Forwarding Policy
- Interface Statistics
- Global Setting
  - Tapplet Setting
- System Configuration
  - Time Zone Configuration
  - Save Configuration
  - Reset Configuration
  - Hostname Configuration
  - Version
- User Management
  - User Configuration
  - Role Configuration
- Log Management 
  - Operation Log
  - Warning Log
```

## Catalogue Structure
Use this catalogue structure in kvm
```

```
-Tapplet-Web
 -backend        #backend source code  
  -data          #Backend uses database and configuration files and static resources
  -rest           
  -tornado
  -web           #Backend interface script
  -web_start.py  #Backend startup script 
 -frontend       #Frontend source code
  -new_static    #Place frontend static resources after compilation
  -config        #Frontend configuration
  -src           #Frontend implementation script	
  -help          #User manual
```


Usage
### Frontend uses command lines
```bash
$ git clone https://github.com/asterfusion/Tapplet-Web.git
$ cd Tapplet-Web/frontend 
$ npm install
$ npm start         #local visit：http://localhost:6061 (interact with kvm through nginx)
```

###  Nginx Configuration(Local development and debugging)
```bash
  server  {
listen  6061;                                        
location  ~  ^/(auth|api|nw|logout)/  {
        proxy_pass  http://192.168.3.65:81;    #kvm running ip
    }  
    location  /  {
        proxy_pass  http://127.0.0.1:8001;        
    }  
    
    }
```    

### 后端使用命令行
```bash
$ git clone https://github.com/asterfusion/Tapplet-Web.git #If cloned, deploy the code to kvm
$ cd Tapplet-Web/backend/ 
$ sudo python3 web_start.py #start server，backend must be deployed in kvm
                            #Backend default port【http：81，https：82】, visit http://kvm.ip:81
```

### Integrated  Development  Environment
```
Frontend        :  Ant  Design  v4.0.0
Backend          :  Python3/Tornado
Environment  :  Liunx(Kvm  Tapplet)
```

###  Configuration Environment
```
1、npm  run  build
2、Copy the dist folder to the frontend folder under kvm
3、python3  web_start.py  #missing modules => pip3  install  package.name
4、visit  http://ip:81
```

##  Supporting Browser
```
Chrome、IE11、FireFox。
```


## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Use Ant Design Pro in your daily work.
- Submit [issues](https://github.com/asterfusion/Tapplet-Web/issues) to report bugs or ask questions.
- Propose [pull requests](https://github.com/asterfusion/Tapplet-Web/pulls) to improve our code.
