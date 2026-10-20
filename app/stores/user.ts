import { defineStore } from 'pinia'
import { api } from '~/api/api'

// useStore 可以任意，比如 useUser, useCart
// 参数1是整个应用中唯一的store id
export const userStore = defineStore('user', {
  state() {
    return {
      showLogin: false,
      isLogin: false,
      info: null as any,
      infoLoaded: false,
    }
  },
  getters: {
    isAdmin(state) {
      const roles = Array.isArray(state.info?.roles)
        ? state.info.roles
        : String(state.info?.roles || '').split(',')
      return roles.map((role: any) => String(role).trim()).includes('role_admin')
    },
  },
  actions: {
    async loadInfo(force = false) {
      if (this.infoLoaded && !force) {
        return this.info
      }
      const result = await api.user.getInfo()
      this.infoLoaded = true
      if (result.success) {
        this.info = result.data
        this.isLogin = true
      } else {
        this.info = null
      }
      return this.info
    },
  },
})
