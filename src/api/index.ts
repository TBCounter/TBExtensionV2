import { api } from 'src/boot/axios';
import { ILoginCreds } from '../types'


export function loginPost(payload: ILoginCreds) {
  process.env.API_URL
  return api.post('auth/login', payload)
}

export function registerPost(payload: ILoginCreds) {
  process.env.API_URL
  return api.post('auth/register', payload)
}

export function getAccounts() {
  return api.get('/accounts/');
}

export function createAccountPost(name: string) {
  return api.post('/accounts/', { name });
}
