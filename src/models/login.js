import { stringify } from 'querystring';
import { router } from 'umi';
import { accountLogin } from '@/services/login';
import { setToken,setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import {isResponseSuccess} from '@/utils/axios'

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      let response = yield call(accountLogin, {user_info:payload});
      if(!isResponseSuccess(response)){
        response={...response,msg:'连接服务器失败',status:'error'}
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        setToken(response.token);
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
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      router.replace({
        pathname: '/user/login',
      })
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, msg: payload.msg };
    },
  },
};
export default Model;
