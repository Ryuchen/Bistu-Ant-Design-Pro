import request from '@/utils/request';

export default async function query() {
  return request('/api/users');
}
