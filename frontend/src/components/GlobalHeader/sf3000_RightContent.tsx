import { ConnectProps, ConnectState } from '@/models/connect';
import React, { Component } from 'react';
import { Icon, Tooltip, Menu } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { connect } from 'dva';
import { ClickParam } from 'antd/lib/menu';
import HeaderDropdown from '../HeaderDropdown';
import { CurrentUser } from '@/models/user';
import router from 'umi/router';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'sf3000_login/logout',
        });
      }
      return;
    }
    //router.push(`/account/${key}`);
  };
  // onVersionClick = () => {
  //   console.log("11")
  //   router.push('/version')
  // }
  render() {
    const { theme, layout, currentUser = {} } = this.props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'topmenu') {
      className = `${styles.right}  ${styles.dark}`;
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* <Menu.Item key="center">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const helpUrl = localStorage.getItem('umi_locale') == "zh-CN" ?  "/nw/help/WebHelp_cn/index.html" : "/nw/help/WebHelp_en/index.html"

    return (
      <div className={className}>
        {/* <span className={styles.versions}>
          <a onClick={this.onVersionClick}>V1.0.0</a>
        </span> */}
        <Tooltip
          title={formatMessage({
            id: 'component.globalHeader.help',
          })}
        >
          <a
            target="_blank"
            href={helpUrl}
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Icon type="user" />
          {currentUser.name}
        </span>
        </HeaderDropdown>
        <SelectLang className={styles.action} />
      </div>
    );
  }
}

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
