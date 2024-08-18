import { defineStore } from 'pinia';
import { loginPost, registerPost } from '../api';
import { useUser } from './user';
import { useStorage } from '@vueuse/core';
import { ILoginCreds, Token } from '../types';
import { useQuasar } from 'quasar';
import { jwtDecode } from 'jwt-decode';

const $q = useQuasar();

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
      if (newToken?.token && $q) {
        $q.cookies.set('jwt', newToken?.token, {
          path: '/',
          expires: 182,
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        this.isAuthenticated = true;
      }
      if (!newToken?.token && $q) {
        this.isAuthenticated = false;
        $q.cookies.remove('jwt', {
          path: '/',
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        $q.cookies.remove('jwt', {
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
