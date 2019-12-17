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

## Usage

### Use Command

```bash
$ git clone https://github.com/asterfusion/Tapplet-Web.git
$ cd Tapplet-Web
$ npm install
$ npm start         # visit http://localhost:8000
```
### Integrated  Development  Environment
```
Frontend        :  Ant  Design  v4.0.0
Backend          :  Python3/Tornado
Environment  :  Liunx(Kvm  Tapplet)

```
###  Nginx Configuration(Local development and debugging)
```bash
  server  {
listen  6061;                                        
location  ~  ^/(auth|api|nw|logout)/  {
        proxy_pass  http://192.168.3.65:81;    #kvm  a certain ip
    }  
    location  /  {
        proxy_pass  http://127.0.0.1:8001;        
    }  
    
    }
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
