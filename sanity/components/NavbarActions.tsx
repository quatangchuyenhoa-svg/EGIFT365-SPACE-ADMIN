import React from 'react'
import { Button, Flex } from '@sanity/ui'
import { HomeIcon } from '@sanity/icons'

/**
 * Custom Navbar Actions Component
 *
 * Adds a "Back to Home" button to the Sanity Studio navbar
 * Allows users to navigate back to the main site
 */
export function NavbarActions() {
  const handleBackToHome = () => {
    // Navigate to the root of the site (outside of /studio)
    window.location.href = '/'
  }

  return (
    <Flex align="center" gap={3}>
      <Button
        icon={HomeIcon}
        mode="ghost"
        tone="primary"
        onClick={handleBackToHome}
        title="Back to Home"
        text="Back to Home"
      />
    </Flex>
  )
}
