import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Categories from '../views/Categories.vue'
import Admin from '../views/Admin.vue'
import Series from '../views/Series.vue'
import SeriesDetail from '../views/SeriesDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/:slug',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/series',
      name: 'series',
      component: Series
    },
    {
      path: '/series/:slug',
      name: 'series-detail',
      component: SeriesDetail
    }
  ]
})

export default router
