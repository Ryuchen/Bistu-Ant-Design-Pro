import {
  queryAcademies,
  queryAcademyProfile,
  queryMajors,
  queryMajorProfile,
} from '@/services/bistu';

export default {
  namespace: 'colleges',

  state: {
    academy: {},
    academies: [],
    major: {},
    majors: [],
  },

  effects: {
    *fetchAcademy({ payload }, { call, put }) {
      const response = yield call(queryAcademyProfile, payload);
      yield put({
        type: 'saveAcademy',
        payload: response,
      });
    },
    *fetchAcademies(_, { call, put }) {
      const response = yield call(queryAcademies);
      yield put({
        type: 'saveAcademies',
        payload: response,
      });
    },
    *fetchMajor({ payload }, { call, put }) {
      const response = yield call(queryMajorProfile, payload);
      yield put({
        type: 'saveMajor',
        payload: response,
      });
    },
    *fetchMajors({ payload }, { call, put }) {
      const response = yield call(queryMajors, payload);
      yield put({
        type: 'saveMajors',
        payload: response,
      });
    },
  },

  reducers: {
    saveAcademy(state, action) {
      return {
        ...state,
        academy: action.payload || {},
      };
    },
    saveAcademies(state, action) {
      return {
        ...state,
        academies: action.payload || [],
      };
    },
    saveMajor(state, action) {
      return {
        ...state,
        major: action.payload || {},
      };
    },
    saveMajors(state, action) {
      return {
        ...state,
        majors: action.payload || [],
      };
    },
  },
};
