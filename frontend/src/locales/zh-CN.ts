import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import users from './zh-CN/nf5000_users';
import login from './zh-CN/nf5000_login';
import home from './zh-CN/nf5000_home';
import policy from './zh-CN/nf5000_policy';
import system from './zh-CN/nf5000_system';
import bsetting from './zh-CN/nf5000_bsetting';
import log from './zh-CN/nf5000_log';
import statistics from './zh-CN/nf5000_statistics';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...users,
  ...login,
  ...home,
  ...policy,
  ...system,
  ...bsetting,
  ...log,
  ...statistics,
};
