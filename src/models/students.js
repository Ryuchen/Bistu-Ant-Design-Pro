import { queryStudents, queryStudentProfile } from '@/services/bistu';

export default {
  namespace: 'students',

  state: {
    student: {},
    students: [],
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
  },

  reducers: {
    saveStudent(state, action) {
      return {
        ...state,
        student: action.payload.data.student || {},
      };
    },
    saveStudents(state, action) {
      return {
        ...state,
        students: action.payload.data.students || [],
      };
    },
  },
};
