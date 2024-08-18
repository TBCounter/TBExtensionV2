<template>
  <q-page class="row items-center justify-evenly">
    <q-card v-if="isLogin" class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>
      <q-form @submit="onSubmitLogin" class="q-gutter-md">
        <q-card-section>
          <q-input
            dense
            outlined
            :error="!!emailError"
            :error-message="emailError"
            v-model="email"
            :rules="[(val: string) => !!val || 'Field is required']"
            label="Email Address"
          ></q-input>
          <q-input
            dense
            outlined
            class="q-mt-md"
            :rules="[(val: string) => !!val || 'Field is required']"
            v-model="password"
            type="password"
            label="Password"
          ></q-input>
        </q-card-section>
        <q-card-section>
          <q-btn
            type="submit"
            style="border-radius: 8px"
            color="dark"
            rounded
            size="md"
            label="Sign in"
            no-caps
            class="full-width"
          ></q-btn>
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Don't have an account yet?
          <a
            class="text-dark text-weight-bold"
            @click="isLogin = false"
            style="text-decoration: none"
            >Sign up.</a
          >
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Sign up</div>
        <div class="text-grey-8">Create an account</div>
      </q-card-section>
      <q-form @submit="onSubmitRegister" class="q-gutter-md">
        <q-card-section>
          <q-input
            dense
            lazy-rules
            :error="emailError"
            :rules="[(val: string) => !!val || 'Field is required']"
            outlined
            v-model="email"
            label="Email Address"
          ></q-input>
          <q-input
            dense
            lazy-rules
            :rules="[(val: string) => !!val || 'Field is required']"
            outlined
            class="q-mt-md"
            v-model="password"
            type="password"
            label="Password"
          ></q-input>

          <q-input
            dense
            lazy-rules
            :rules="[
              (val: string) => !!val || 'Field is required',
              (val: string) => val === password || 'Passswords don`t match',
            ]"
            outlined
            class="q-mt-md"
            v-model="passwordRepeat"
            type="password"
            label="Repeat password"
          ></q-input>
        </q-card-section>
        <q-card-section>
          <q-btn
            style="border-radius: 8px"
            color="dark"
            rounded
            size="md"
            label="Sign in"
            no-caps
            class="full-width"
            type="submit"
          ></q-btn>
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Already have an account?
          <a
            class="text-dark text-weight-bold"
            @click="isLogin = true"
            style="text-decoration: none"
            >Log in.</a
          >
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
    .login({password: password.value, email:email.value})
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
