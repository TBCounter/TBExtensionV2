import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';

import routes from './routes';
import { useJWT } from 'src/stores/jwt';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    console.log(to.name)
    if( to.name === 'bexSettings'){
      console.log('ok?')
      next()
      return true
    }

    const jwt = useJWT();
    if ((!jwt.jwt || !jwt.isNotExpired()) && to.name !== 'login') {
      jwt.logout()
      console.log('redirect to login')
      return next({ name: 'login' })
    } else {
      console.log('auth user')
      jwt.isAuthenticated = true
      next()
    }
  })

  return Router;
});
