import Sidebar from './SideBar.vue'
import SidebarLink from './SidebarLink.vue'

const SidebarStore = {
  showSidebar: false,
  displaySidebar(value) {
    this.showSidebar = value
  },
}

const SidebarPlugin = {
  install(app) {
    // [중요] Vue 3 방식: Object.defineProperty 대신 직접 할당
    app.config.globalProperties.$sidebar = SidebarStore

    // 전역 컴포넌트 등록
    app.component('side-bar', Sidebar)
    app.component('sidebar-link', SidebarLink)
  },
}

export default SidebarPlugin
