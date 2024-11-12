import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import {
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

// 路由meta信息
export interface RouteRecordMeta extends Record<string, any> {
  title: string
  icon: any // 图标 antd-vue的icon组件
  noLayoutContent: boolean // 容器是否加一个layout-content类
  roles: string[]
  hide: boolean
  keepAlive: boolean
}

// 路由记录
export interface RouteRecord extends Record<string, any> {
  path: string
  name: string
  redirect?: string
  component?: () => Promise<typeof import("*.vue")>
  meta?: Partial<RouteRecordMeta>
  children?: Array<RouteRecord>
}

// 路由记录列表
export const routes: Array<RouteRecord> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/route1',
    meta: {
      title: '管理后台模板'
    },
    children: [{
      path: 'route1',
      name: 'Route1',
      redirect: '/route1/route10',
      meta: {
        title: 'route1',
        icon: PieChartOutlined,
        roles: ['admin']
      },
      children: [{
        path: 'route10',
        name: 'Route10',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route10'
        }
      }]
    }, {
      path: 'route2',
      name: 'Route2',
      component: () => import('@/views/Example.vue'),
      meta: {
        title: 'route2',
        icon: DesktopOutlined,
        roles: ['admin1'] // 权限不足-隐藏菜单
      }
    }, {
      path: 'route3',
      name: 'Route3',
      redirect: '/route3/route30',
      meta: {
        title: 'route3',
        icon: MailOutlined,
        roles: ['admin']
      },
      children: [{
        path: 'route30',
        name: 'Route30',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route30'
        }
      }, {
        path: 'route31',
        name: 'Route31',
        component: () => import('@/views/Example.vue'),
        meta: {
          title: 'route31',
          noLayoutContent: true // 不加载layout-content类
        }
      }]
    }, {
      path: 'route4',
      name: 'Route4',
      component: () => import('@/views/Example.vue'),
      meta: {
        title: 'route4',
        icon: BarChartOutlined,
        roles: ['admin'],
        hide: true // 隐藏菜单
      }
    }, {
      path: 'example',
      name: 'Example',
      component: () => import('@/views/Example.vue'),
      meta: {
        title: 'example',
        icon: DesktopOutlined,
        hide: true
      }
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFind',
    component: () => import('@/views/NotFind.vue')
  }
]

// 如果服务器环境是dev和uat才添加debug路由
if (['dev', 'uat'].includes(import.meta.env.MODE)) {
  routes.push({
    path: '/debug',
    name: 'Debug',
    component: () => import('@/views/Debug.vue')
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[]
})

export default router
