import { queryPermiss, query as queryUsers, createUser, editUser, deleteUser,
         queryRoles, createRole, editRole, deleteRole, queryPermissions } from '@/services/sf3000_user';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface CurrentUserInfo {
  username?: CurrentUserInfo | undefined;
  rolename?: string;
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  geographic?: any;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}
export interface UserMode1State {
  currentUser?: CurrentUserInfo;
  currentRole?: string;
  currentPerm?: any;
  users?:any;
  roles?:any;
  permissions?:any;
  userCount?:Number;
  roleCount?:Number;
}
export interface UserMode1Type {
  namespace: 'sf3000_user';
  state: UserMode1State;
  effects: {
    queryUsers: Effect;
    queryPermiss: Effect;
    createUser: Effect;
    editUser: Effect;
    deleteUser: Effect;
    queryRoles: Effect;
    createRole: Effect;
    editRole: Effect;
    deleteRole: Effect;
    queryPermissions: Effect;
  };
  reducers: {
    saveCurrentPermiss: Reducer<UserMode1State>;
    changeNotifyCount: Reducer<UserMode1State>;
    query_Users: Reducer<UserMode1State>;
    query_Roles: Reducer<UserMode1State>;
    query_Permissions: Reducer<UserMode1State>;
  };
}
const UserMode1: UserMode1Type = {
  namespace: 'sf3000_user',
  state: {
    currentUser: {},
    currentRole: "",
    currentPerm: {},//现在用户的权限
    users: [],
    roles: [],
    permissions: [],//permissions
    userCount: undefined,
    roleCount: undefined
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
    /*********************Users***********************/
    *queryUsers(_, { call, put }) {
      const response = yield call(queryUsers);
      console.log("in queryUsers",response)
      yield put({               
        type: 'query_Users',        
        payload: response,
      });
    },
    *queryPermiss(_, { call, put }) {
      const response = yield call(queryPermiss);
      console.log("in queryPermiss",response)
      yield put({
        type: 'saveCurrentPermiss',
        payload: response,
      });
    },
    *createUser({ payload }, { call }) {
      const user = yield call(createUser, payload);
      return user;
    },
    *editUser({ payload }, { call }) {
      const user = yield call(editUser, payload);
      return user;
    },
    *deleteUser({ payload }, { call }) {
      const response = yield call(deleteUser, payload);
      return response;
    },
    /**********************Roles*********************/
    *queryRoles(_, { call, put }) {
      const response = yield call(queryRoles);
      yield put({
        type: 'query_Roles',
        payload: response,
      });
    },
    *createRole({ payload }, { call }) {
      const role = yield call(createRole, payload);
      return role;
    },
    *editRole({ payload }, { call }) {
      const role = yield call(editRole, payload);
      return role;
    },
    *deleteRole({ payload }, { call }) {
      const response = yield call(deleteRole, payload);
      return response;
    },
    *queryPermissions({ payload }, { call, put }) {
      console.log("querypermissions in model")
      const response = yield call(queryPermissions, payload);
      yield put({
        type: 'query_Permissions',
        payload: response,
      })
    }
  },
  reducers: {
    saveCurrentPermiss(state, action) {
      console.log("queryCurrent in model",action.payload)
      const userPerm:any = action.payload.data.permiss
      console.log("queryCurrent in model",userPerm)
      let authList = {}
      userPerm.forEach((item:any)=>{
        Object.keys(item["items"]).forEach((name)=>{
            authList[name+"_read"] = item["items"][name]["is_read"] == "1" ? true : false
            authList[name+"_write"] = item["items"][name]["is_write"] == "1" ? true : false
        })
      })
      console.log(authList)
      return {
        ...state,
        currentPerm: authList,
        currentRole: action.payload.data.rolename || "",
      }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    /*********************Users*********************/
    query_Users(state, action){
      console.log(action);
      console.log(action.payload)
      return {
        ...state,
        users: action.payload.data || [],
        userCount: action.payload.count
      };
    },
    /**********************Roles********************/
    query_Roles(state, action){
      console.log(action.payload)
      return {
        ...state,
        roles: action.payload.data || [],
        roleCount: action.payload.count
      }
    },
    query_Permissions(state, action){
      console.log("query_permissions in model",action.payload)
      return {
        ...state,
        permissions: action.payload.data || []
      }
    }
  },
};
export default UserMode1;
