<template>
  <app-layout>
    <h1>Dashboard</h1>

    <a-row :gutter="16">
      <a-col :span="8">
        <a-card>
          <a-statistic
            title="Total Registrations"
            :value="stats.totalRegistrations"
            :loading="loading"
          >
            <template #prefix>
              <team-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card>
          <a-statistic
            title="Deleted Registrations"
            :value="stats.deletedRegistrations"
            :loading="loading"
          >
            <template #prefix>
              <delete-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card>
          <a-statistic
            title="Active Form"
            :value="formExists ? 'Available' : 'Not Created'"
            :value-style="formExists ? { color: '#3f8600' } : { color: '#cf1322' }"
            :loading="loading"
          >
            <template #prefix>
              <form-outlined />
            </template>
          </a-statistic>
          <a-button type="primary" style="margin-top: 16px" @click="navigateToFormBuilder">
            {{ formExists ? 'Edit Form' : 'Create Form' }}
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <a-divider />

    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="Recent Registrations">
          <a-table
            :dataSource="recentRegistrations"
            :columns="columns"
            :loading="loading"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button type="link" @click="viewUser(record)">View</a-button>
              </template>
            </template>
          </a-table>
          <div style="margin-top: 16px; text-align: right">
            <a-button type="link" @click="() => router.push('/registrations')"> View All </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </app-layout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AppLayout from '../components/AppLayout.vue'
import { TeamOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const store = useStore()

const loading = computed(() => store.getters.isLoading)
const stats = computed(() => store.getters.stats)
const formExists = computed(() => store.getters.formExists)
const recentRegistrations = computed(() => store.getters.users.slice(0, 5))

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'first_name',
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

onMounted(() => {
  // Fetch users from the store
  store.dispatch('fetchUsers')
})

const navigateToFormBuilder = () => {
  router.push('/form-builder')
}

const viewUser = (user) => {
  console.log('View user:', user)
}
</script>
