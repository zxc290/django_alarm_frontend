import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import page1 from '@/components/page1'
import page2 from '@/components/page2'
import page3 from '@/components/page3'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: Home,
    //   children: [
    //     {path: 'rules/:id', name: 'rulelist', component: page2, props: true},
    //     // {path: 'rules/:game', name: 'test', component: page1, props: true},
    //   ]
    // },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {path: 'rules/:id', name: 'rulelist', component: page3, props: true},
        // {path: 'rules/:game', name: 'test', component: page1, props: true},
      ]
    },
  ]
})
