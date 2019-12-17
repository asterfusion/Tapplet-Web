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
          type: 'nf5000_login/logout',
        });
      }
      return;
    }
  };
  render() {
    const { theme, layout, currentUser = {} } = this.props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'topmenu') {
      className = `${styles.right}  ${styles.dark}`;
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const helpUrl = localStorage.getItem('lang') == "zh-CN" ? "/nw/help/WebHelp_cn/index.html" : "/nw/help/WebHelp_en/index.html"
    const current_username = localStorage.getItem('currentUsername') ? localStorage.getItem('currentUsername') : '';
    return (
      <div className={className}>
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
        <SelectLang className={styles.action} />
         <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Icon type="user" />&nbsp;
            {current_username}
        </span>
        </HeaderDropdown>
      </div>
    );
  }
}

export default connect(({ user, settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
