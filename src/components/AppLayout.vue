<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard" @click="() => router.push('/')">
          <template #icon><dashboard-outlined /></template>
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="form-builder" @click="() => router.push('/form-builder')">
          <template #icon><form-outlined /></template>
          <span>Form Builder</span>
        </a-menu-item>
        <a-menu-item key="registrations" @click="() => router.push('/registrations')">
          <template #icon><team-outlined /></template>
          <span>Registrations</span>
        </a-menu-item>
        <a-menu-item key="account" @click="() => router.push('/account')">
          <template #icon><user-outlined /></template>
          <span>Account</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="header-right">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent> {{ adminUser.name }} <down-outlined /> </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="account" @click="() => router.push('/account')">
                  Account Settings
                </a-menu-item>
                <a-menu-item key="logout" @click="handleLogout"> Logout </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <slot></slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Admin Panel ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  FormOutlined,
  TeamOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

const selectedKeys = computed(() => {
  const path = route.path
  if (path === '/') return ['dashboard']
  if (path === '/form-builder') return ['form-builder']
  if (path === '/registrations') return ['registrations']
  if (path === '/account') return ['account']
  return []
})

const adminUser = ref({
  name: 'Admin User',
  email: 'admin@example.com',
})

onMounted(() => {
  const userData = localStorage.getItem('admin_user')
  if (userData) {
    adminUser.value = JSON.parse(userData)
  }
})

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.header-right {
  float: right;
  margin-right: 20px;
}

.ant-dropdown-link {
  cursor: pointer;
}
</style>
