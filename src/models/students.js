import {
  queryStudents,
  queryStudentProfile,
  queryStudentStatistics,
  queryStudentTotalExport,
} from '@/services/bistu';

export default {
  namespace: 'students',

  state: {
    student: {},
    students: {},
    statistics: [],
  },

  effects: {
    *fetchStudent({ payload }, { call, put }) {
      const response = yield call(queryStudentProfile, payload);
      yield put({
        type: 'saveStudent',
        payload: response,
      });
    },
    *fetchStudents({ payload }, { call, put }) {
      const response = yield call(queryStudents, payload);
      yield put({
        type: 'saveStudents',
        payload: response,
      });
    },
    *fetchStatistics({ payload }, { call, put }) {
      const response = yield call(queryStudentStatistics, payload);
      yield put({
        type: 'saveStatistics',
        payload: response,
      });
    },
    *fetchTotalExcel({ payload }, { call }) {
      return yield call(queryStudentTotalExport, payload);
    },
  },

  reducers: {
    saveStudent(state, action) {
      return {
        ...state,
        student: action.payload || {},
      };
    },
    saveStudents(state, action) {
      return {
        ...state,
        students: action.payload || {},
      };
    },
    saveStatistics(state, action) {
      return {
        ...state,
        statistics: action.payload || [],
      };
    },
  },
};
