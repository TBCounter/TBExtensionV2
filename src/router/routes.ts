import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/LoginPage.vue'), name: 'login' },
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'home' },
      { path: '/new-account', component: () => import('pages/NewAccountPage.vue'), name: 'new' },
      { path: '/account/:id', component: () => import('pages/AccountPage.vue'), name: 'account' }
    ],
  },
  {
    path: '/settings',
    component: ()=> import('pages/SettingsPage.vue'),
    name: 'bexSettings'
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
