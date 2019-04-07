import { queryAcademies, queryAcademyProfile } from '@/services/bistu';

export default {
  namespace: 'colleges',

  state: {
    academy: {},
    academies: [],
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
  },

  reducers: {
    saveAcademy(state, action) {
      return {
        ...state,
        academy: action.payload.data.academy || {},
      };
    },
    saveAcademies(state, action) {
      return {
        ...state,
        academies: action.payload.data.academies || [],
      };
    },
  },
};
