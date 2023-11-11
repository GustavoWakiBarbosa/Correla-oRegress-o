import { useDrawerStore } from '~/stores/drawer'
import type { UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ isClient, initialState, app }) => {
  if (isClient) {
    const drawerStore = useDrawerStore()
    function scrollToId(id: string) {
      drawerStore.showDrawer = false
      const to = document.querySelector(id)
      if (to) {
        const scrollY = window.scrollY || document.documentElement.scrollTop
        const toTop = to.getBoundingClientRect().top
        const isUp = scrollY > toTop
        const y = toTop + scrollY - (isUp ? 96 : 0)
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    app.provide('scrollToId', scrollToId)
  }
}