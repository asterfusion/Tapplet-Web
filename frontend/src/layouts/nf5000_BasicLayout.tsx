/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import { ConnectState, ConnectProps } from '@/models/connect';
import RightContent from '@/components/GlobalHeader/nf5000_RightContent';
import { connect } from 'dva';
import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import logo_bak from '../assets/logo_bak.jpg';
// import logo from '../assets/logo.png';

import Authorized from '@/utils/Authorized';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  BasicLayout as BasicLayoutComponents,
  BasicLayoutProps as BasicLayoutComponentsProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import Link from 'umi/link';
export interface BasicLayoutProps extends BasicLayoutComponentsProps, ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings, collapsed } = props;
  /**
   * constructor
   */
  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'nf5000_user/queryPermiss',
      });//获取当前用户信息用于用户名称显示；useState是一个React-hooks可以在函数内使用状态；
      dispatch({
        type: 'settings/getSetting',
      });
    }
  });

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean) =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

    const logo_using =  collapsed ? logo_bak : logo

  return (
    <BasicLayoutComponents
      logo={logo_using}  
      // logo={<div style={{width:256, height:64}}><img src={logo} alt=""/></div>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ];
      }}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </BasicLayoutComponents>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
