import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', () => {
  const showDrawer = ref(false)

  return {
    showDrawer
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDrawerStore, import.meta.hot))