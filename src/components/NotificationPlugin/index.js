import { reactive } from 'vue'
import Notifications from './Notifications.vue'

const NotificationStore = reactive({
  state: [],
  settings: {
    overlap: false,
    verticalAlign: 'top',
    horizontalAlign: 'right',
    type: 'info',
    timeout: 5000,
    closeOnClick: true,
    showClose: true,
  },
  setOptions(options) {
    this.settings = Object.assign(this.settings, options)
  },
  removeNotification(timestamp) {
    const indexToDelete = this.state.findIndex((n) => n.timestamp === timestamp)
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1)
    }
  },
  addNotification(notification) {
    if (typeof notification === 'string' || notification instanceof String) {
      notification = { message: notification }
    }
    notification.timestamp = new Date()
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length,
    )
    notification = Object.assign({}, this.settings, notification)
    this.state.push(notification)
  },
  notify(notification) {
    if (Array.isArray(notification)) {
      notification.forEach((notificationInstance) => {
        this.addNotification(notificationInstance)
      })
    } else {
      this.addNotification(notification)
    }
  },
})

const NotificationsPlugin = {
  install(app, options) {
    // Vue 3의 전역 프로퍼티 등록 방식 ($notify, $notifications)
    app.config.globalProperties.$notify = (notification) => {
      NotificationStore.notify(notification)
    }
    app.config.globalProperties.$notifications = NotificationStore

    // 컴포넌트 등록
    app.component('Notifications', Notifications)

    if (options) {
      NotificationStore.setOptions(options)
    }
  },
}

export default NotificationsPlugin
