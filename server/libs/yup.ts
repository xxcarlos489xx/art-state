import * as yup from 'yup'
import { setLocale } from 'yup'
import { es, en, fr, ja } from 'yup-locales'

export { yup, setLocale }

export const localesMap = {
  es,
  en,
  fr,
  ja
} as const

export type LocaleKey = keyof typeof localesMap