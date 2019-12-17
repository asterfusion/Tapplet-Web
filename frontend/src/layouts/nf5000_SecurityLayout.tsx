import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { ConnectState, ConnectProps, UserMode1State, Route } from '@/models/connect';
import { CurrentStatus } from '@/models/nf5000_login';
import PageLoading from '@/components/PageLoading';
import { updateRoute } from './nf5000_updateRoute';
import isEqual from 'lodash/isEqual'

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  queringPermiss: boolean;
  status: CurrentStatus;
  currentPerm: UserMode1State;
  currentRole: UserMode1State;
  route: Route;
}

interface SecurityLayoutState {
  isReady: boolean;
  isGetPermiss: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
    isGetPermiss: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'nf5000_login/fetchCurrent'
      })
      if (localStorage.getItem("antd-pro-authority") !== 'undefined') {
        dispatch({
          type: 'nf5000_user/queryPermiss'
        })
      }
    }

  }
  componentDidUpdate(prevProps: any, prevState: any) {
    const { currentPerm, currentRole, route } = this.props
    if (currentPerm && currentRole && !isEqual(prevProps.currentPerm, currentPerm) && localStorage.getItem("antd-pro-authority") !== 'undefined') {
      updateRoute(currentPerm, currentRole, route.routes)
    }
    if (currentPerm && currentRole && !this.state.isGetPermiss) {
      this.setState({
        isGetPermiss: true
      })
    }
  }


  render() {
    const { isReady, isGetPermiss } = this.state;
    const { children, loading, status } = this.props;
    const isLogin = status && status.status_code !== 400
    if ((!isLogin && loading) || !isReady || (isLogin && !isGetPermiss)) {
      return <PageLoading />;
    }
    if (!isLogin) {
      localStorage.removeItem('currentUsername')
      return <Redirect to={`/auth/login`}></Redirect>;
    } else if (isLogin && isGetPermiss) {
      return children;
    }
  }
}

export default connect(({ nf5000_login, nf5000_user, loading }: ConnectState) => ({
  status: nf5000_login.status,
  currentPerm: nf5000_user.currentPerm,
  currentRole: nf5000_user.currentRole,
  loading: loading.effects['nf5000_login/fetchCurrent'],
}))(SecurityLayout);
