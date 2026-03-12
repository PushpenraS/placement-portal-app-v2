import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/login',
      name : 'login',
      alias : ['/'],
      component: () => import('../views/LoginView.vue')
    },
    {
      path : '/register',
      name : 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path : '/dashboard',
      name : 'admin_dashboard',
      component: () => import('../views/AdminDashboardView.vue')
    },
    {
      path : '/dashboard/employer',
      name : 'employer_dashboard',
      component: () => import('../views/EmployerDashboardView.vue')
    },
    {
      path : '/dashboard/candidate',
      name : 'candidate_dashboard',
      component: () => import('../views/CandidateDashboardView.vue')
    },
  ],
})

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('role') || ''
  const authToken = localStorage.getItem('auth_token') || ''
  const isPublicRoute = to.path === '/login' || to.path === '/register' || to.path === '/'

  if (isPublicRoute) {
    next()
    return
  }

  if (!authToken || !role) {
    next('/login')
    return
  }

  if (to.path.startsWith('/dashboard/candidate') && role !== 'candidate') {
    next('/login')
    return
  }

  if (to.path.startsWith('/dashboard/employer') && role !== 'employer') {
    next('/login')
    return
  }

  if (to.path === '/dashboard' && role !== 'admin') {
    next('/login')
    return
  }

  next()
})

export default router
