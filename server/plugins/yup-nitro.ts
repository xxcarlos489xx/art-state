import { setLocale, localesMap, LocaleKey } from '~/server/libs/yup'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    // Detecta el idioma del header (ej: 'es-ES', 'en-US' => 'es', 'en')
    let lang = event.node.req.headers['accept-language']?.slice(0, 2) as LocaleKey || 'ja'

    if (!(lang in localesMap)) {
      lang = 'en'
    }
    
    setLocale(localesMap[lang])
  })
})
