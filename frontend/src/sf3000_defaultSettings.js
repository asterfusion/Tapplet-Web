
const { frabic_mode } = require("./sf3000_controllerSetting");

module.exports = {
  navTheme: frabic_mode == "af" ? 'afc' : 'tfc', // theme for nav menu
  primaryColor: frabic_mode == "af" ? '#1d50a2' : '#F5222E', // primary color of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: false,
  },
  pwa: true,
  // your iconfont Symbol Scrip Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont图标项目里要进行批量去色处理
  iconfontUrl: '',
  "collapse": true
};
