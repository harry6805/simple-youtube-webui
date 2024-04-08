import Vue from 'vue'
import VueRouter from 'vue-router'
import VideoList from '../views/VideoList.vue'
import PlayVideo from '../views/PlayVideo.vue'
import SearchVideo from '../views/SearchVideo.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: VideoList,
      meta:{requireAuth: false}
    },
    {
      path: '/play',
      name: 'play',
      component: PlayVideo,
      meta:{requireAuth: false}
    },
    {
      path: '/search',
      name: 'search',
      component: SearchVideo,
      meta:{requireAuth: false}
    },
  ]
})

export default router
