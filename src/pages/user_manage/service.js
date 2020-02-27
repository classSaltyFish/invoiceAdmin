import request from '@/utils/request';
import api from '../../utils/axios';

export async function queryRule(params) {
  return api.post('/user/list/', params);
}

export async function removeRule(params) {
  return api.post('/user/delete/', params);
}

export async function freezeRule(params) {
  return api.post('/user/suspend/', params);
}

export async function unfreezeRule(params) {
  return api.post('/user/unsuspend/', params);
}
