import request from '@/utils/request';
import api from '../../utils/axios';

export async function queryRule(params) {
  return api.get(`/invoice/list/${params.key}/${params.current}/${params.pageSize}`);
}

export async function operateRule(params) {
  return api.post('/invoice/auditInvoice',params)
}

