<template>
  <q-page class="row items-center justify-evenly">
    <q-card v-if="isLogin" class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">{{ $t('login.signIn') }}</div>
        <div class="text-grey-8">{{ $t('login.signInDescription') }}</div>
      </q-card-section>
      <q-form @submit="onSubmitLogin" class="q-gutter-md">
        <q-card-section>
          <q-input dense outlined :error="!!emailError" :error-message="emailError" v-model="email"
            :rules="[(val: string) => !!val || $t('login.required')]" :label="$t('login.email')"></q-input>
          <q-input dense outlined class="q-mt-sm" :rules="[(val: string) => !!val || $t('login.required')]"
            v-model="password" type="password" :label="$t('login.password')"></q-input>
        </q-card-section>
        <q-card-section>
          <q-btn type="submit" style="border-radius: 8px" color="dark" rounded size="md" :label="$t('login.signIn')"
            no-caps class="full-width"></q-btn>
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          {{ $t('login.dontHave') }}
          <span class="text-dark text-weight-bold cursor-pointer" @click="isLogin = false"
            style="text-decoration: none">{{
              $t('login.signUp') }}.</span>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">{{ $t('login.signUp') }}</div>
        <div class="text-grey-8">{{ $t('login.signUpDescription') }}</div>
      </q-card-section>
      <q-form @submit="onSubmitRegister" class="q-gutter-md">
        <q-card-section>
          <q-input dense lazy-rules :error="emailError" :rules="[(val: string) => !!val || $t('login.required')]"
            outlined v-model="email" :label="$t('login.email')"></q-input>
          <q-input dense lazy-rules :rules="[(val: string) => !!val || $t('login.required')]" outlined class="q-mt-sm"
            v-model="password" type="password" :label="$t('login.password')"></q-input>

          <q-input dense lazy-rules :rules="[
            (val: string) => !!val || $t('login.required'),
            (val: string) => val === password || $t('login.dontMatch'),
          ]" outlined class="q-mt-sm" v-model="passwordRepeat" type="password" :label="$t('login.repeat')"></q-input>
        </q-card-section>
        <q-card-section>
          <q-btn style="border-radius: 8px" color="dark" rounded size="md" :label="$t('login.signUp')" no-caps
            class="full-width" type="submit"></q-btn>
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          {{ $t('login.alreadyHave') }}
          <span class="text-dark text-weight-bold cursor-pointer" @click="isLogin = true"
            style="text-decoration: none">{{
              $t('login.signIn') }}.</span>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useJWT } from 'src/stores/jwt';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { useQuasar } from 'quasar';

const $q = useQuasar();
const jwt = useJWT();
const router = useRouter();

const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
const isLogin = ref(true);

const emailError = ref();

async function onSubmitLogin() {
  await jwt
    .login({ password: password.value, email: email.value })
    .then(() => {
      router.push('/');
    })
    .catch((error) => {
      console.log(error.response.status);
      if (error.response.status == 401) {
        emailError.value = 'Wrong login or password';
      }
      return;
    });
}

async function onSubmitRegister() {
  console.log(process.env.API_URL);
  await jwt.register({ password: password.value, email: email.value })
    .then(() => {
      isLogin.value = true;
      $q.notify('You have been successfuly registered');
    })
    .catch((error) => {
      console.log(error.response.status);
      if (error.response.status == 401) {
        emailError.value = 'Wrong login or password';
      }
      return;
    });
}

watch(email, () => {
  emailError.value = undefined;
});

watch(password, () => {
  emailError.value = undefined;
});
</script>
