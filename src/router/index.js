import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import page2 from '@/components/page2'
import mainContent from "../components/mainContent";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        { path: 'rules/:id', name: 'rulelist', component: mainContent, props: true },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]
});

router.beforeEach((to, from ,next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = sessionStorage.getItem('userToken');
    if (token === null || token === '') {
      next('/login')
    } else {
      next();
    }
  }
});

export default router

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component: Home,
//       children: [
//         {path: 'rules/:id', name: 'rulelist', component: page3, props: true},
//         // {path: 'rules/:game', name: 'test', component: page1, props: true},
//       ]
//     },
//   ]
// })
