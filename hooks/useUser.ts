"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useUserStore, type UserProfile } from "@/store/useUserStore"

/**
 * Hook để sync user state từ Supabase với Zustand store
 * Nên gọi ở root layout hoặc component cần user data
 */
export function useUser() {
  const { user, profile, setUser, setProfile, setLoading, clearUser } = useUserStore()

  useEffect(() => {
    const supabase = createClient()

    // Lấy user hiện tại
    const getUser = async () => {
      setLoading(true)
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (currentUser) {
          setUser(currentUser)

          // Fetch profile từ database
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single()

          if (profileData && !error) {
            setProfile(profileData as UserProfile)
          }
        } else {
          clearUser()
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        clearUser()
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)

        // Fetch profile
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileData && !error) {
          setProfile(profileData as UserProfile)
        }
      } else if (event === "SIGNED_OUT") {
        clearUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading, clearUser])

  return {
    user,
    profile,
    isLoading: useUserStore((state) => state.isLoading),
  }
}

