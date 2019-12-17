import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getSysLog, getWaringLog } from '@/services/sf3000_log';

export interface LogModelState {
  returnSysLogData?: [];
  returnWaringLogData?: [];
}

export interface LogModelType {
  namespace: 'sf3000_log';
  state: LogModelState;
  effects: {
    getSysLog: Effect;
    getWaringLog: Effect;
    setCommonConfig: Effect;
  };
  reducers: {
    get_sysLog: Reducer<LogModelState>;
    get_waringLog: Reducer<LogModelState>;
  }
}

const LogModel: LogModelType = {
  namespace: 'sf3000_log',
  state: {
    returnSysLogData: [],
    returnWaringLogData: [],
  },

  effects: {
    *getSysLog({ payload }, { call, put }) {
      const response = yield call(getSysLog, payload);
      return response;
    },
    *getWaringLog({ payload }, { call, put }) {
      const response = yield call(getWaringLog, payload);
      return response;
    },
    *setCommonConfig({ payload }, { call, put }) {
      const response = yield call(getWaringLog, payload);
      return response;
    },
  },
  reducers: {
    get_sysLog(state, action) {
      return {
        ...state,
        returnSysLogData: action.payload || [],
      };
    },
    get_waringLog(state, action) {
      return {
        ...state,
        returnWaringLogData: action.payload || [],
      };
    },
  }
}

export default LogModel;