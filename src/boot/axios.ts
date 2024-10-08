import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

import { useJWT } from '../stores/jwt';
import { Cookies } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_URL });


api.interceptors.request.use((request) => {
  if (request.url && ['auth/login', 'auth/register'].includes(request.url)) {
    return request;
  }
  const jwt = useJWT();
  if (request.headers && jwt.jwt) {
    request.headers.Authorization = `Bearer ${jwt.jwt}`;
  }
  const cookies = process.env.SERVER ? undefined : Cookies;
  if (cookies?.get('utm_source')) {
    request.headers['Utm-Source'] = cookies?.get('utm_source');
  }
  return request;
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
