import Authorized from '@/utils/Authorized';
import { ConnectProps, ConnectState, UserModelState, Route, LoginMode1State } from '@/models/connect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import Redirect from 'umi/redirect';
import { CurrentStatus } from '@/models/nf5000_login';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
  nf5000_login: LoginMode1State;
  status: CurrentStatus;
}

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined = undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      authorities = route.authority || authorities;
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location,
  status
}) => {
  const { routes = [] } = route;
  const isLogin = status && status.status_code !== 400;//判断当前是否登陆
  return (
    <Authorized
      authority={getRouteAuthority(location!.pathname, routes)!}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/auth/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ nf5000_login }: ConnectState) => ({
    status: nf5000_login.status,
}))(AuthComponent);
