[English](./README.md)  |  简体中文  

<h1  align="center">Asterfusion</h1>

###  功能
Tapplet-Web通过Web界面的方式配置管理Tapplet，功能包含如下：
```
-  主界面
-  转发策略
-  接口统计
-  全局配置
    -  Tapplet设置
-  系统配置
    -  时区配置
    -  保存配置
    -  复位配置
    -  主机名配置
    -  查看版本
-  用户管理
    -  用户配置
    -  角色配置
-  日志管理
    -  操作日志
    -  告警日志
```

使用
###  使用命令行

```bash
$  git  clone  https://github.com/asterfusion/Tapplet-Web.git
$  cd  Tapplet-Web  
$  npm  install
$  npm  start                  #  访问  http://localhost:8000
```

###  集成开发环境
```
Frontend        :  Ant  Design  v4.0.0
Backend          :  Python3/Tornado
Environment  :  Liunx(Kvm  Tapplet)
```
###  Nginx配置(本地开发调试使用)
```bash
  server  {
listen  6061;                                        
location  ~  ^/(auth|api|nw|logout)/  {
        proxy_pass  http://192.168.3.65:81;    #kvm  具体运行ip
    }  
    location  /  {
        proxy_pass  http://127.0.0.1:8001;        
    }  
    
    }
```    

###  配置环境
```
1、npm  run  build
2、将dist文件夹拷贝到kvm下的frontend文件夹下
3、python3  web_start.py  #如缺失扩展  pip3  install  package.name
4、访问  http://ip:81
```

##  浏览器支持
```
Chrome、IE11、FireFox。
```

##  参与贡献
我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建  :smiley:：
-  通过  [Issue](https://github.com/asterfusion/Tapplet-Web/issues)  报告  bug  或进行咨询。
-  提交  [Pull  Request](https://github.com/asterfusion/Tapplet-Web/pulls)  改进  Tapplet-Web  的代码。