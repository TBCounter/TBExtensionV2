import { defineStore } from 'pinia';
import { loginPost, registerPost } from '../api';
import { useUser } from './user';
import { useStorage } from '@vueuse/core';
import { ILoginCreds, Token } from '../types';
import { jwtDecode } from 'jwt-decode';
import { Cookies } from 'quasar';

export const useJWT = defineStore({
  id: 'jwt',
  state: () => ({
    jwt: useStorage('jwt', ''),
    isAuthenticated: false,
  }),
  getters: {
    token: (state) => state.jwt,
  },
  actions: {
    setJWT(newToken: Token | undefined) {

      this.jwt = newToken?.token || '';
      if (newToken?.token && Cookies) {
        Cookies.set('jwt', newToken?.token, {
          path: '/',
          expires: 182,
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        this.isAuthenticated = true;
      }
      if (!newToken?.token && Cookies) {

        this.isAuthenticated = false;

        Cookies.remove('jwt', {
          path: '/',
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        Cookies.remove('jwt', {
          path: '/',
        });
      }
    },
    async login(payload: ILoginCreds) {
      try {
        const response = await loginPost(payload);
        this.setJWT(response.data);

        const user = useUser();
        await user.fillUserInfo();

        return response;
      } catch (error) {
        throw error;
      }
    },
    async register(payload: ILoginCreds) {
      try {
        const response = await registerPost(payload);
        this.setJWT(response.data);

        const user = useUser();
        await user.fillUserInfo();

        return response;
      } catch (error) {
        throw error;
      }
    },
    logout() {

      // it's better to use user logout
      this.setJWT(undefined);
    },
    isNotExpired() {
      try {
        return (jwtDecode(this.token).exp || 0) > (+new Date / 1000)
      }
      catch {
        return false
      }
    }
  },
});
