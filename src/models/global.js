import { globalDefinitions } from '@/services/bistu';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    definitions: {},
  },

  effects: {
    *fetchGlobalDefinitions(_, { put, call }) {
      const response = yield call(globalDefinitions);
      yield put({
        type: 'saveDefinitions',
        payload: response,
      });
    },
  },

  reducers: {
    saveDefinitions(state, { payload }) {
      return {
        ...state,
        definitions: payload,
      };
    },
  },
};
