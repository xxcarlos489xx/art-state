import { FormWizard, TabContent } from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('FormWizard', FormWizard)
    nuxtApp.vueApp.component('TabContent', TabContent)
})