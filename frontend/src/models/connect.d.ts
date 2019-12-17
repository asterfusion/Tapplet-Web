import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { UserMode1State } from './nf5000_user';
import { LoginMode1State } from './nf5000_login';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { MenuDataItem } from '@ant-design/pro-layout';
export { GlobalModelState, SettingModelState, UserModelState, UserMode1State, LoginMode1State };

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  nf5000_user: UserMode1State;
  nf5000_login: LoginMode1State;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T extends { [key: string]: any } = {}>
  extends Partial<RouterTypes<Route>> {
  dispatch?: Dispatch;
}

export default ConnectState;
