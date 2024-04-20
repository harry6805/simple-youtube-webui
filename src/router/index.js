import Vue from 'vue'
import VueRouter from 'vue-router'
import VideoList from '../views/VideoList.vue'
import PlayVideo from '../views/PlayVideo.vue'
import SearchVideo from '../views/SearchVideo.vue'
import ContinueWatch from '../views/ContinueWatch.vue'
import Favorites from '../views/Favorites.vue'
import Subscribes from '../views/Subscribes.vue'
import ChannelContent from '../views/ChannelContent.vue'
import PlayListContent from '../views/PlayListContent.vue'

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
    {
      path: '/continue',
      name: 'continue_watch',
      component: ContinueWatch,
      meta:{requireAuth: false}
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites,
      meta:{requireAuth: false}
    },
    {
      path: '/subscribes',
      name: 'Subscribes',
      component: Subscribes,
      meta:{requireAuth: false}
    },
    {
      path: '/channelcontent',
      name: 'ChannelContent',
      component: ChannelContent,
      meta:{requireAuth: false}
    },
    {
      path: '/playlist',
      name: 'PlaylistContent',
      component: PlayListContent,
      meta:{requireAuth: false}
    },
  ]
})

export default router
