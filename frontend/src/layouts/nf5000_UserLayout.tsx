import SelectLang from '@/components/SelectLang';
import GlobalFooter from '@/components/nf5000_GlobalFooter';
import { ConnectProps } from '@/models/connect';
import { Icon } from 'antd';
import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-locale';
import Link from 'umi/link';
import logo from '../assets/nf5000_as_logo1.png';
import styles from './nf5000_UserLayout.less';
import { MenuDataItem, getPageTitle, getMenuData } from '@ant-design/pro-layout';
import { Redirect } from 'umi';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> Asterfusion
  </Fragment>
);

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
  navTheme: string;
}

class UserLayout extends Component<UserLayoutProps> {

  render() {
    if (localStorage.getItem('currentUsername')) {
      return  <Redirect to={`/`}/>;
    }
    const {
      route = {
        routes: [],
      },
    } = this.props;
    const { routes = [] } = route;
    const { children, location } = this.props;
    const { breadcrumb } = getMenuData(routes, this.props);
    return (
      <DocumentTitle
        title={getPageTitle({
          pathname: location!.pathname,
          breadcrumb,
          title: "Asterfusion",
          formatMessage,
        })}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <img alt="logo" className={styles.logo} src={logo} />
            </div>
            <div className={styles.lang}>
              <SelectLang />
            </div>
          </div>
          <div className={styles.top}>
            <div className={styles.formcontent}>
              <div className={styles.formtitle}>
                {formatMessage({ id: 'app.login.hello' })}
              </div>
              {children}

            </div>
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
          <div className={styles.login_foot}>
            {copyright}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
