<template>
  <div class="login-container">
    <a-card title="Admin Login" class="login-card">
      <a-form :model="loginForm" @finish="handleLogin" :rules="rules" layout="vertical">
        <a-form-item name="username" label="Username">
          <a-input v-model:value="loginForm.username" placeholder="admin" />
        </a-form-item>

        <a-form-item name="password" label="Password">
          <a-input-password v-model:value="loginForm.password" placeholder="password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block> Login </a-button>
        </a-form-item>
      </a-form>

      <a-alert v-if="error" type="error" :message="error" show-icon />
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const loading = ref(false)
const error = ref('')

const loginForm = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Please input your username!' }],
  password: [{ required: true, message: 'Please input your password!' }],
}

const handleLogin = () => {
  loading.value = true
  error.value = ''

  store
    .dispatch('login', loginForm)
    .then(() => {
      router.push('/')
    })
    .catch((err) => {
      error.value = err.message || 'Invalid username or password'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
