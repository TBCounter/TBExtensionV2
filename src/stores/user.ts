import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useJWT } from './jwt';
import { ref } from 'vue';
import { Account } from 'src/types';
import { getAccounts } from 'src/api';
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n'

export const useUser = defineStore('user', () => {
  const router = useRouter();
  const jwt = useJWT();
  const { locale } = useI18n()

  const filledInfo = ref(false)
  const accounts = ref<Account[]>();

  const userLocale = useStorage('locale', locale)

  function switchLocale() {
    if (userLocale.value === 'en-US') {
      userLocale.value = 'ru-RU'
    } else {
      userLocale.value = 'en-US'
    }
  }



  async function logout() {
    jwt.logout();
    router.push('/login');
  }
  async function fillUserInfo() {
    await getAccounts().then((response) => {
      accounts.value = response.data.accounts;
      filledInfo.value = true;
    });
  }



  return { logout, fillUserInfo, accounts, filledInfo, userLocale, switchLocale };
});
