import BaseInput from './components/Inputs/BaseInput.vue'
import BaseCheckbox from './components/Inputs/BaseCheckbox.vue'
import BaseRadio from './components/Inputs/BaseRadio.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import Card from './components/Cards/Card.vue'

const GlobalComponents = {
  install(app) {
    app.component('base-input', BaseInput)
    app.component('base-checkbox', BaseCheckbox)
    app.component('base-radio', BaseRadio)
    app.component('base-dropdown', BaseDropdown)
    app.component('card', Card)
  },
}

export default GlobalComponents
