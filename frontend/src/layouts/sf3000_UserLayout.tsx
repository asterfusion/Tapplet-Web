import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import GlobalFooter from '@/components/sf3000_GlobalFooter';///////
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Icon } from 'antd';
import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/sf3000_as_logo.png';
import styles from './sf3000_UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}
const copyright = (
    <Fragment>
      Copyright <Icon type="copyright" /> Teraspek{/**最好避免使用老版，后期看看怎么改 */}
    </Fragment>
  );
const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.logo}>
              <img alt="logo" className={styles.logo} src={logo} />
            </div>
            <div className={styles.lang}>
                <SelectLang />
            </div>
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.head}>
                {formatMessage({id:'app.login.hello'})}
            </div>
            {children}
          </div>
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);