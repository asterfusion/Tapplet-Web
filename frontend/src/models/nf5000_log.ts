import { getSysLog, getWaringLog } from '@/services/nf5000_log';

export default {
  namespace: 'nf5000_log',
  state: {
    returnSysLogData: [],
    returnWaringLogData: [],
  },
  /*
   *************redux-saga中的api*****************
   *dva中的effects属性处理side effect（异步任务），基于redux-saga实现
   *call(func,(...args))          命令middleware以参数调用func
   *put(action)                   命令middleware向store发起一个action
   *action是一个对象{type:'...',(error, payload, meta)}
   *
   * effects把异步获取的响应put，再通过reducer更新state
   */
  effects: {
    /*********************Users*********************/
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
    /*********************Users*********************/
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