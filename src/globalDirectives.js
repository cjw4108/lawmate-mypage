import clickOutside from './directives/click-outside.js'

const GlobalDirectives = {
  install(app) {
    app.directive('click-outside', clickOutside)
  },
}

export default GlobalDirectives
