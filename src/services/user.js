import request from '@/utils/request';
import axios from '@/utils/axios';

export async function queryCurrent() {
  return axios.get('/user/currentUser');
  // return request('/api/currentUser');
}

