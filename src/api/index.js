import http from '@/utils/request'
export const getTestAPI = params => http.get('test', { params })
