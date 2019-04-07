import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { AccountLogin, AccountLogout } from '@/services/bistu';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        // Login successfully
        if (response.data.status >= 200 && response.data.status < 300) {
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              redirect = null;
            }
          }
          yield put(routerRedux.replace(redirect || '/'));
        }
      }
    },

    *logout(_, { call, put }) {
      const response = yield call(AccountLogout);
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            data: {
              currentAuthority: 'guest',
            },
          },
        });
        // Logout successfully
        if (response.data.status >= 200 && response.data.status < 300) {
          reloadAuthorized();
          // redirect
          if (window.location.pathname !== '/user/login') {
            yield put(
              routerRedux.replace({
                pathname: '/user/login',
                search: stringify({
                  redirect: window.location.href,
                }),
              })
            );
          }
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
