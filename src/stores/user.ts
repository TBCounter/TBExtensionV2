import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useJWT } from './jwt';
import { ref } from 'vue';
import { Account, NodeStatuses } from 'src/types';
import { getAccounts } from 'src/api';
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n'
import { io, Socket } from 'socket.io-client';
import { Notify } from 'quasar';

export const useUser = defineStore('user', () => {
  const router = useRouter();
  const jwt = useJWT();
  const { locale, t } = useI18n()

  const accounts = ref<Account[]>();

  const userLocale = useStorage('locale', locale)

  const socket = ref<Socket>()

  const nodeStatus = ref<NodeStatuses>({ idle: 0, busy: 0 })
  const ocrNodeStatus = ref<NodeStatuses>({ idle: 0, busy: 0 })

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
    // await getAccounts().then((response) => {
    //   accounts.value = response.data.accounts;
    // });
    connectToServer()
  }

  function connectToServer(){
    if(socket.value?.active) return

    socket.value = io(process.env.API_URL+'/user', {
      query: {token: jwt.token}
    })

    // client-side
    socket.value.on('connect', () => {
      console.log(socket.value?.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.value.on('disconnect', () => {
      console.log(socket.value?.id); // undefined
      Notify.create({type: 'negative', message:t('sockets.error.disconnect')})
    });

    socket.value.on('connect_error', (/*error*/) => {
      if (socket.value?.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        Notify.create({type: 'negative', message:t('sockets.error.conection')})
      }
    });


    socket.value.on('user_auth', (payload)=>{
      if(payload === 'success'){
        Notify.create({type: 'positive', message:t('sockets.success')})
      }
    })

    socket.value.on('user_payload', (payload: {user_accounts: Account[], user_nodes: NodeStatuses, user_ocr_nodes: NodeStatuses})=>{
      accounts.value = payload.user_accounts
      nodeStatus.value = payload.user_nodes
      ocrNodeStatus.value = payload.user_ocr_nodes
    })


  }



  return { logout, fillUserInfo, accounts, userLocale, switchLocale, nodeStatus, ocrNodeStatus };
});
