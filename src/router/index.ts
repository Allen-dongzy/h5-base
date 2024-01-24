import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import {
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined
} from '@ant-design/icons-vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/route1',
    meta: {
      title: '管理后台模板'
    },
    children: [{
      path: 'route1',
      name: 'route1',
      redirect: '/route1/route10',
      meta: {
        title: 'route1',
        icon: PieChartOutlined,
        roles: ['admin']
      },
      children: [{
        path: 'route10',
        name: 'route10',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route10'
        }
      }]
    }, {
      path: 'route2',
      name: 'route2',
      component: () => import('@/views/Example.vue'),
      meta: {
        title: 'route2',
        icon: DesktopOutlined,
        roles: ['admin']
      }
    }, {
      path: 'route3',
      name: 'route3',
      redirect: '/route3/route30',
      meta: {
        title: 'route3',
        icon: MailOutlined,
        roles: ['admin']
      },
      children: [{
        path: 'route30',
        name: 'route30',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route30'
        }
      }, {
        path: 'route31',
        name: 'route31',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route31'
        }
      }]
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFind',
    component: () => import('@/views/NotFind.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
