<template>
  <app-layout>
    <h1>Registration Management</h1>

    <a-card>
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="8">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search by name or email"
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="16" style="text-align: right">
          <a-button type="primary" @click="fetchUsers">
            <template #icon><reload-outlined /></template>
            Refresh
          </a-button>
        </a-col>
      </a-row>

      <a-table
        :dataSource="users"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" />
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="viewUser(record)">View</a-button>
            <a-button type="link" danger @click="confirmDelete(record)">Delete</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- User Detail Modal -->
    <a-modal v-model:visible="userDetailVisible" title="User Details" :footer="null" width="600px">
      <a-descriptions bordered v-if="selectedUser">
        <a-descriptions-item label="ID" span="3">{{ selectedUser.id }}</a-descriptions-item>
        <a-descriptions-item label="Avatar" span="3">
          <a-avatar :size="64" :src="selectedUser.avatar" />
        </a-descriptions-item>
        <a-descriptions-item label="First Name">{{ selectedUser.first_name }}</a-descriptions-item>
        <a-descriptions-item label="Last Name">{{ selectedUser.last_name }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ selectedUser.email }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <!-- Delete Confirmation Modal -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="Confirm Delete"
      @ok="handleDelete"
      :okButtonProps="{ danger: true, loading: deleting }"
      okText="Delete"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this user?</p>
      <p v-if="selectedUser">
        <strong>{{ selectedUser.first_name }} {{ selectedUser.last_name }}</strong> ({{
          selectedUser.email
        }})
      </p>
      <p>This action cannot be undone.</p>
    </a-modal>
  </app-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const users = ref([])
const searchText = ref('')
const userDetailVisible = ref(false)
const deleteModalVisible = ref(false)
const selectedUser = ref(null)
const deleting = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: 6,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['6', '12', '24', '48'],
})

const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    width: 80,
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
  },
  {
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'first_name',
    sorter: true,
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'last_name',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
  },
]

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true

  try {
    const response = await fetch(
      `https://reqres.in/api/users?page=${pagination.current}&per_page=${pagination.pageSize}`,
    )
    const data = await response.json()

    users.value = data.data || []
    pagination.total = data.total || 0
  } catch (error) {
    console.error('Error fetching users:', error)
    message.error('Failed to fetch users')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag, filters, sorter) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize

  // Handle sorting if needed
  if (sorter.field && sorter.order) {
    console.log('Sort by:', sorter.field, sorter.order)
    // In a real app, you would pass these to your API
  }

  fetchUsers()
}

const handleSearch = () => {
  pagination.current = 1 // Reset to first page
  fetchUsers()

  // In a real app, you would pass the search text to your API
  // For this demo, we're just logging it
  console.log('Search for:', searchText.value)
}

const viewUser = (user) => {
  selectedUser.value = user
  userDetailVisible.value = true
}

const confirmDelete = (user) => {
  selectedUser.value = user
  deleteModalVisible.value = true
}

const handleDelete = () => {
  if (!selectedUser.value) return

  deleting.value = true

  // Simulate API call
  setTimeout(() => {
    try {
      // In a real app, you would call your API to delete the user
      // For this demo, we're just removing it from the local array
      users.value = users.value.filter((user) => user.id !== selectedUser.value.id)

      // Update deleted count in localStorage
      const deletedCount = parseInt(localStorage.getItem('deleted_count') || '0')
      localStorage.setItem('deleted_count', (deletedCount + 1).toString())

      message.success('User deleted successfully')
      deleteModalVisible.value = false
    } catch (error) {
      console.error('Error deleting user:', error)
      message.error('Failed to delete user')
    } finally {
      deleting.value = false
    }
  }, 1000)
}
</script>
