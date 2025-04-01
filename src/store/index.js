import { createStore } from 'vuex'

export default createStore({
  state: {
    // Auth
    token: localStorage.getItem('admin_token') || null,
    user: JSON.parse(localStorage.getItem('admin_user') || 'null'),

    // Form Builder
    registrationForm: JSON.parse(localStorage.getItem('registration_form') || 'null'),

    // Registrations
    users: [],
    pagination: {
      current: 1,
      pageSize: 6,
      total: 0,
    },
    loading: false,

    // Dashboard
    stats: {
      totalRegistrations: 0,
      deletedRegistrations: parseInt(localStorage.getItem('deleted_count') || '0'),
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    formExists: (state) => !!state.registrationForm,
    registrationForm: (state) => state.registrationForm || { fixedFields: [], customFields: [] },
    users: (state) => state.users,
    pagination: (state) => state.pagination,
    isLoading: (state) => state.loading,
    stats: (state) => state.stats,
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('admin_token', token)
    },

    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('admin_user', JSON.stringify(user))
    },

    LOGOUT(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    },

    SET_REGISTRATION_FORM(state, form) {
      state.registrationForm = form
      localStorage.setItem('registration_form', JSON.stringify(form))
    },

    SET_USERS(state, users) {
      state.users = users
    },

    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    DELETE_USER(state, userId) {
      state.users = state.users.filter((user) => user.id !== userId)
      state.stats.deletedRegistrations++
      localStorage.setItem('deleted_count', state.stats.deletedRegistrations.toString())
    },

    SET_STATS(state, stats) {
      state.stats = { ...state.stats, ...stats }
    },
  },

  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
          if (credentials.username === 'admin' && credentials.password === 'password') {
            const token = 'admin_' + Math.random().toString(36).substring(2)
            const user = {
              username: credentials.username,
              name: 'Admin User',
              email: 'admin@example.com',
            }

            commit('SET_TOKEN', token)
            commit('SET_USER', user)
            resolve(user)
          } else {
            reject(new Error('Invalid username or password'))
          }
        }, 1000)
      })
    },

    logout({ commit }) {
      commit('LOGOUT')
    },

    updateAccount({ commit }, userData) {
      return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          commit('SET_USER', userData)
          resolve()
        }, 1000)
      })
    },

    saveForm({ commit }, formData) {
      return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          commit('SET_REGISTRATION_FORM', formData)
          resolve()
        }, 1000)
      })
    },

    fetchUsers({ commit, state }) {
      commit('SET_LOADING', true)

      return fetch(
        `https://reqres.in/api/users?page=${state.pagination.current}&per_page=${state.pagination.pageSize}`,
      )
        .then((response) => response.json())
        .then((data) => {
          commit('SET_USERS', data.data || [])
          commit('SET_PAGINATION', { total: data.total || 0 })
          commit('SET_STATS', { totalRegistrations: data.total || 0 })
          return data
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },

    deleteUser({ commit }, userId) {
      return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          commit('DELETE_USER', userId)
          resolve()
        }, 1000)
      })
    },
  },
})
