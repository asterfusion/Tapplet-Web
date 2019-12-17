import { routerRedux } from 'dva/router';
import { Reducer, AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { parse } from 'qs';
import { fetchCurrent, login, logout } from '@/services/nf5000_login';
import { reloadAuthorized } from '@/utils/Authorized';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export interface LoginParamsType {
  userName: string;
  password: string;
}
export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
  status_code?: number;
  username?: string;
}
export interface CurrentStatus{
  status_code?: Number;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface LoginMode1State {
  status?: CurrentStatus;
  currentUser?: CurrentUser;
}

export interface Mode1Type {
  namespace: string;
  state: LoginMode1State;
  effects: {
    fetchCurrent: Effect;
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginMode1State>;
    saveCurrentUser: Reducer<LoginMode1State>;
  };
}

const LoginMode1: Mode1Type = {
  namespace: 'nf5000_login',

  state: {
    status: {},
    currentUser: {},
  },

  effects: {
    //测试当前是否为登陆状态
    *fetchCurrent(_,{ call, put }){
      const response = yield call(fetchCurrent)
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
    },
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      //Login successfully
      if (response && response.status_code == 200) {
        reloadAuthorized();
        yield window.location.replace('/')  
        yield localStorage.setItem('currentUsername', response.data.username)
        yield localStorage.setItem('antd-pro-authority', response.data.rolename)
      }
    },
    *logout(_, { call, put }) {
      const { redirect } = getPageQuery();
      yield call(logout)
      //Logout successfully
      if (window.location.pathname !== '/auth/login' && !redirect) {
        yield window.location.replace('/#/auth/Login')
        yield localStorage.removeItem('antd-pro-authority');
        yield localStorage.removeItem('currentUsername');
      }
    },
  },

  reducers: {
    changeLoginStatus(state,action) {
      return {
        ...state,
        status: {status_code: action.payload.status_code},
      };
    },
    saveCurrentUser(state,action){
      return {
        ...state,
        status: {status_code: action.payload.status_code},
        currentUser: action.payload || {},
      }
    }
  },
};

export default LoginMode1;
