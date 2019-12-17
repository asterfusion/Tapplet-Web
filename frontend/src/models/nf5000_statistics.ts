import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryStatistics, queryTrendData, queryGroupName } from '@/services/nf5000_statistics'


export interface StatisticsModelState {
    currentStatisticsData?: any;
    currentTrendData?: any;
    currentGroupName?: any;
}
export interface StatisticsModelType {
    namespace: 'nf5000_statistics';
    state: StatisticsModelState;
    effects: {
        queryStatistics: Effect,
        queryTrendData: Effect,
        queryGroupName: Effect,
    },
    reducers: {
        query_statistics: Reducer<StatisticsModelState>,
        query_trend_statistics: Reducer<StatisticsModelState>,
        query_group_name: Reducer<StatisticsModelState>
    }
}

const StatisticsModel: StatisticsModelType = {
    namespace: 'nf5000_statistics',
    state: {
        currentStatisticsData: [],
        currentTrendData: [],
        currentGroupName: []
    },
    effects: {
        *queryStatistics({ payload }, { call, put }){
            const response = yield call(queryStatistics, payload)
            yield put({
                type: 'query_statistics',
                payload: response
            })
            return response
        },
        *queryTrendData({ payload }, { call, put }){
            const response = yield call(queryTrendData, payload)
            yield put({
                type: 'query_trend_statistics',
                payload: response
            })
            return response
        },
        *queryGroupName(_,{ call, put }){
            const response = yield call(queryGroupName)
            yield put({
                type: 'query_group_name',
                payload: response
            })
        }
    },
    reducers: {
        query_statistics(state, action){
            return {
                ...state,
                currentStatisticsData: action.payload || []
            }
        },
        query_trend_statistics(state, action){
            return {
                ...state,
                currentTrendData: action.payload || []
            }
        },
        query_group_name(state, action){
            return {
                ...state,
                currentGroupName: action.payload || []
            }
        }
    }
}

export default StatisticsModel;