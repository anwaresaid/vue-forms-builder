<template>
  <app-layout>
    <h1>Admin Account</h1>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="Account Information">
          <a-form :model="accountForm" layout="vertical" @finish="updateAccount" :rules="rules">
            <a-form-item name="username" label="Username">
              <a-input v-model:value="accountForm.username" />
            </a-form-item>

            <a-form-item name="name" label="Full Name">
              <a-input v-model:value="accountForm.name" />
            </a-form-item>

            <a-form-item name="email" label="Email">
              <a-input v-model:value="accountForm.email" type="email" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="updating">
                Update Account
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Change Password">
          <a-form
            :model="passwordForm"
            layout="vertical"
            @finish="updatePassword"
            :rules="passwordRules"
          >
            <a-form-item name="currentPassword" label="Current Password">
              <a-input-password v-model:value="passwordForm.currentPassword" />
            </a-form-item>

            <a-form-item name="newPassword" label="New Password">
              <a-input-password v-model:value="passwordForm.newPassword" />
            </a-form-item>

            <a-form-item name="confirmPassword" label="Confirm New Password">
              <a-input-password v-model:value="passwordForm.confirmPassword" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="updatingPassword">
                Change Password
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="Account Actions" style="margin-top: 16px">
          <a-button danger block @click="confirmLogout"> Logout </a-button>
        </a-card>
      </a-col>
    </a-row>

    <!-- Logout Confirmation Modal -->
    <a-modal
      v-model:visible="logoutModalVisible"
      title="Confirm Logout"
      @ok="handleLogout"
      okText="Logout"
      cancelText="Cancel"
    >
      <p>Are you sure you want to logout?</p>
    </a-modal>
  </app-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()
const updating = ref(false)
const updatingPassword = ref(false)
const logoutModalVisible = ref(false)

const accountForm = reactive({
  username: '',
  name: '',
  email: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  username: [{ required: true, message: 'Please input your username!' }],
  name: [{ required: true, message: 'Please input your name!' }],
  email: [
    { required: true, message: 'Please input your email!' },
    { type: 'email', message: 'Please enter a valid email!' },
  ],
}

const passwordRules = {
  currentPassword: [{ required: true, message: 'Please input your current password!' }],
  newPassword: [
    { required: true, message: 'Please input your new password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password!' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('The two passwords do not match!'))
      },
    }),
  ],
}

onMounted(() => {
  // Load user data from localStorage
  const userData = localStorage.getItem('admin_user')
  if (userData) {
    const user = JSON.parse(userData)
    accountForm.username = user.username || ''
    accountForm.name = user.name || ''
    accountForm.email = user.email || ''
  }
})

const updateAccount = () => {
  updating.value = true

  // Simulate API call
  setTimeout(() => {
    try {
      // Update user data in localStorage
      const userData = {
        username: accountForm.username,
        name: accountForm.name,
        email: accountForm.email,
      }

      localStorage.setItem('admin_user', JSON.stringify(userData))
      message.success('Account updated successfully')
    } catch (error) {
      console.error('Error updating account:', error)
      message.error('Failed to update account')
    } finally {
      updating.value = false
    }
  }, 1000)
}

const updatePassword = () => {
  updatingPassword.value = true

  // Simulate API call
  setTimeout(() => {
    try {
      // In a real app, you would call your API to update the password
      // For this demo, we're just showing a success message
      message.success('Password updated successfully')

      // Reset form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } catch (error) {
      console.error('Error updating password:', error)
      message.error('Failed to update password')
    } finally {
      updatingPassword.value = false
    }
  }, 1000)
}

const confirmLogout = () => {
  logoutModalVisible.value = true
}

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/login')
}
</script>
