import Notifications from '@/components/NotificationPlugin'
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/SidebarPlugin/index-v3.js'

import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/sass/light-bootstrap-dashboard.scss'
import '@/assets/css/demo.css'

export default {
  install(app) {
    app.use(GlobalComponents)
    app.use(GlobalDirectives)
    app.use(SideBar)
    app.use(Notifications)
  }
}
