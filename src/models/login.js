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
        window.location.href = '/';
      }
    },

    logout() {
      setToken(null);
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
