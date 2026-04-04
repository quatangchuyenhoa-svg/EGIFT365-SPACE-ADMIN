export const fallbackLng = 'vi'
export const languages = [fallbackLng, 'en']
export const defaultNS = 'common'
export const cookieName = 'NEXT_LOCALE'

export function getOptions (lng = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS: ns,
    ns
  }
}
