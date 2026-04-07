'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg, I18nextProvider } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { cookieName, languages, fallbackLng, defaultNS } from './settings'

// Initialize i18next on the client
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
  .init({
    supportedLngs: languages,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS: defaultNS,
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: cookieName,
      caches: ['cookie'],
    },
    preload: languages
  })

export function TranslationProvider({ 
  children, 
  lng, 
  resources 
}: { 
  children: React.ReactNode, 
  lng: string, 
  resources: Record<string, Record<string, unknown>> 
}) {
  // Populate global instance if resources provided
  if (resources && lng) {
    const bundle = resources[lng]
    if (bundle) {
      Object.entries(bundle).forEach(([namespace, bundleResources]) => {
        if (!i18next.hasResourceBundle(lng, namespace)) {
          i18next.addResourceBundle(lng, namespace, bundleResources, true, true)
        }
      })
    }
  }

  // Ensure language is set on server pre-render
  if (lng && i18next.language !== lng) {
    i18next.changeLanguage(lng)
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}

export function useTranslation(ns: string | string[] = 'common', options: { keyPrefix?: string, lng?: string } = {}) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  
  // If we're on the client and receiving an explicit lng (from a prop), sync it
  useEffect(() => {
    if (options.lng && i18n.language !== options.lng) {
      i18n.changeLanguage(options.lng)
    }
  }, [options.lng, i18n])

  // Sync language with page
  useEffect(() => {
    if (!i18n.resolvedLanguage) return
    document.documentElement.lang = i18n.resolvedLanguage
  }, [i18n.resolvedLanguage])

  return ret
}
