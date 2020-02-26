import request from '@/utils/request';
import axios from '@/utils/axios';

export async function accountLogin(params) {
  return axios.post('/user/adminLogin/', params);
}
