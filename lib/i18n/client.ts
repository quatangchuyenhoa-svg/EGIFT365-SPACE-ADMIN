'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
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
