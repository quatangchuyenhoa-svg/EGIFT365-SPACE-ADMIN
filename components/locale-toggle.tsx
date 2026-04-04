'use client'

import * as React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cookieName } from "@/lib/i18n/settings"
import { useTranslation } from "@/lib/i18n/client"

export function LocaleToggle() {
  const router = useRouter()
  const { i18n, t } = useTranslation('header')
  const currentLng = i18n.resolvedLanguage

  const changeLanguage = (lng: string) => {
    // Set cookie that middleware reads
    document.cookie = `${cookieName}=${lng}; path=/; max-age=31536000` // 1 year
    
    // Changes i18next state on the client
    i18n.changeLanguage(lng).then(() => {
        // Refresh the page to trigger Server-side re-render with new locale
        router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('vi')}
          className={currentLng === 'vi' ? "bg-accent font-bold" : ""}
        >
          Tiếng Việt (VI)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLng === 'en' ? "bg-accent font-bold" : ""}
        >
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
