1、不同公司的图标存放于对应的文件夹中，使用时将sf3000_as_logo.png拷贝至 ant-design-pro\Login\assets目录下并替换已有的图片，页面标
   题和版权(copyright)需在ant-design-pro\Login目录下的login.html和login.js文件中修改，全部完成后将Login文件夹中所有内容拷贝至设备
   /rootfs/rest/web/new_static目录下

2、将logo.jpg和logo_bak.jpg拷贝至ant-design-pro\src\assets目录下并替换已有的图片，如需修改样式，在ant-design-pro\src\global.less文件中调整
   .ant-pro-sider-menu-logo中相关的属性，全部完成后在ant-design-pro目录下执行npm run build命令，在ant-design-pro目录下会生成一个dist文件夹，
   将dist文件夹中的所有内容拷贝至设备/rootfs/rest/web/new_static目录下

3、在ant-design-pro\config\defaultSettings.ts文件中修改导出的title，在ant-design-pro\src\pages\document.ejs文件中修改title

4、默认公司为中创腾锐，如需修改，参照1和2