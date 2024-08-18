import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useJWT } from './jwt';
import { ref } from 'vue';
import { Account } from 'src/types';
import { getAccounts } from 'src/api';

export const useUser = defineStore('user', () => {
  const router = useRouter();
  const jwt = useJWT();

  const filledInfo = ref(false)
  const accounts = ref<Account[]>();


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



  return { logout, fillUserInfo, accounts, filledInfo };
});
