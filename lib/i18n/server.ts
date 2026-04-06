import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { cookies, headers } from 'next/headers'
import { getOptions, cookieName, fallbackLng } from './settings'

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function getTranslation(ns: string | string[] = 'common', options: { keyPrefix?: string } = {}) {
  const cookieStore = await cookies()
  const headerList = await headers()
  
  // Try to get locale from cookie first, then custom header (set by middleware), then fallback
  const lng = cookieStore.get(cookieName)?.value || headerList.get('x-locale') || fallbackLng
  
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data
  }
}
