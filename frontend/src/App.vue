<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const role = ref(localStorage.getItem('role') || '')

function syncRoleFromStorage() {
  role.value = localStorage.getItem('role') || ''
}

watch(
  () => route.fullPath,
  () => {
    syncRoleFromStorage()
  }
)

const candidateDashboardTo = computed(() => '/dashboard/candidate')

async function logout() {
  const authToken = localStorage.getItem('auth_token') || ''
  if (authToken) {
    try {
      await fetch('http://127.0.0.1:5000/api/logout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authentication-Token': authToken
        }
      })
    } catch {
      // Best effort logout.
    }
  }

  localStorage.removeItem('auth_token')
  localStorage.removeItem('role')
  syncRoleFromStorage()
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <span class="navbar-brand">Placement Portal</span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <template v-if="!role">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/login">Login</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/register">Register</RouterLink>
              </li>
            </template>

          </ul>

          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <template v-if="role === 'candidate'">
              <li class="nav-item">
                <RouterLink class="btn btn-outline-secondary ms-2" :to="{ path: candidateDashboardTo, query: { panel: 'history' } }">History</RouterLink>
              </li>
            </template>
            <li class="nav-item" v-if="role">
              <button class="btn btn-outline-secondary ms-2" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <RouterView/>
  </div>
</template>
