import { queryTeachers, queryTeacherProfile } from '@/services/bistu';

export default {
  namespace: 'teachers',

  state: {
    teacher: {},
    teachers: [],
  },

  effects: {
    *fetchTeacher({ payload }, { call, put }) {
      const response = yield call(queryTeacherProfile, payload);
      yield put({
        type: 'saveTeacher',
        payload: response,
      });
    },
    *fetchTeachers({ payload }, { call, put }) {
      const response = yield call(queryTeachers, payload);
      yield put({
        type: 'saveTeachers',
        payload: response,
      });
    },
  },

  reducers: {
    saveTeacher(state, action) {
      return {
        ...state,
        teacher: action.payload.data || {},
      };
    },
    saveTeachers(state, action) {
      return {
        ...state,
        teachers: action.payload.data || [],
      };
    },
  },
};
