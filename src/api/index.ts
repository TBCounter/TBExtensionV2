import { api } from 'src/boot/axios';
import { saveAs } from 'file-saver';

import { ILoginCreds, IStartCookiePayload } from '../types';

export function loginPost(payload: ILoginCreds) {
  process.env.API_URL;
  return api.post('auth/login', payload);
}

export function registerPost(payload: ILoginCreds) {
  process.env.API_URL;
  return api.post('auth/register', payload);
}

export function getAccounts() {
  return api.get('/accounts/');
}

export function createAccountPost(name: string) {
  return api.post('/accounts/', { name });
}

export function runAccount(payload: IStartCookiePayload) {
  return api.post('/accounts/cookie', payload);
}

export function getSessions(accountId: string) {
  return api.get('/sessions/', {
    params: {
      accountId,
    },
  });
}

export function getChests(
  accountId: string,
  startDate?: string,
  endDate?: string
) {
  return api
    .get('/chest/', {
      params: {
        accountId,
        startDate,
        endDate,
      },
      responseType: 'blob', // Указываем, что ожидается файл (BLOB)
    })
    .then((response) => {
      // Создаем Blob из данных ответа
      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8;',
      });

      // Скачиваем файл с помощью file-saver
      saveAs(blob, `chests_${accountId}_${startDate}_${endDate}.csv`);
    })
    .catch((error) => {
      console.error('Error while downloading the file:', error);
    });
}
