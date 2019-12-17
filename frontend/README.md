[English](./README.en.md)  |  简体中文  

<h1 align="center">Tapplet-Web</h1>

### 功能
Tapplet-Web通过Web界面的方式配置管理Tapplet，功能包含如下：
```
- 主界面
- 转发策略
- 接口统计
- 全局配置
  - Tapplet设置
- 系统配置
  - 时区配置
  - 保存配置
  - 复位配置
  - 主机名配置
  - 查看版本
- 用户管理
  - 用户配置
  - 角色配置
- 日志管理
  - 操作日志
  - 告警日志
```

### 目录结构
kvm上保持该目录结构
```
-Tapplet-Web
 -backend        #后端源码 
  -data          #后端使用数据库及配置文件和静态资源
  -rest           
  -tornado
  -web           #后端接口脚本 
  -web_start.py  #后端启动脚本 
 -frontend       #前端源码 
  -new_static    #编译后放置前端静态资源（kvm上保留该文件夹即可）
  -config        #前端配置 
  -src           #前端实现脚本	
  -help          #用户手册
```

使用
### 前端使用命令行
```bash
$ git clone https://github.com/asterfusion/Tapplet-Web.git
$ cd Tapplet-Web/frontend 
$ npm install
$ npm start         #本地访问：http://localhost:6061，通过nginx转发请求与kvm交互
```

### Nginx配置(本地开发调试使用)
```bash
 server {
	listen 6061;                    
	location ~ ^/(auth|api|nw|logout)/ {
    proxy_pass http://192.168.1.xx:81;  #kvm 具体运行ip
  } 
  location / {
    proxy_pass http://127.0.0.1:8001;   #Tapplet-Web 前端本地开发，默认绑定8001端口
  }   
  }
```  

### 后端使用命令行
```bash
$ git clone https://github.com/asterfusion/Tapplet-Web.git #如上面已clone，可以将代码部署到kvm上
$ cd Tapplet-Web/backend/ 
$ sudo python3 web_start.py #启动服务，后端必须部署运行在kvm中，需要与Tapplet Rest Api交互
                            #后端默认端口【http：81，https：82】，访问 http://kvm.ip:81
```

### 集成开发环境(Integrated Development Environment)
```
Frontend    : Ant Design v4.0.0
Backend     : Python3/Tornado
Environment : Liunx(Kvm Tapplet)
IDE         ：Vscode
```

### 配置环境
```
1、npm run build
2、将dist文件夹拷贝到kvm下的frontend/new_static文件夹下
3、python3 web_start.py #如缺失扩展 pip3 install package.name
4、访问 http://kvm.ip:81
```

## 浏览器支持
```
Chrome、IE11、FireFox。
```

## 参与贡献
我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 :smiley:：
- 通过 [Issue](https://github.com/asterfusion/Tapplet-Web/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/asterfusion/Tapplet-Web/pulls) 改进 Tapplet-Web 的代码。
