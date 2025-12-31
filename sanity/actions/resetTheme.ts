import { DocumentActionComponent, DocumentActionProps, useDocumentOperation } from 'sanity'

/**
 * Default Theme Colors
 * 12 admin-controlled colors
 */
export const DEFAULT_THEME = {
  headerBg: '#FFFFFF',
  bodyBg: '#FDFBF7',
  footerBg: '#69372A',
  surfaceBg: '#FFFFFF',
  overlayBg: '#F5F1EB',
  buttonPrimaryBg: '#EB9947',
  buttonPrimaryHover: '#D68331',
  buttonOutlineText: '#EB9947',
  buttonOutlineBorder: '#EB9947',
  textHeading: '#3D2817',
  textBody: '#69372A',
  textHover: '#D68331',
}

/**
 * Reset Theme Action
 *
 * Adds "Reset Theme" button to siteSettings document
 * Resets all 12 color fields to default values
 */
export const ResetThemeAction: DocumentActionComponent = (props: DocumentActionProps) => {
  // Use the hook to get patch and publish operations (must be called before any conditional returns)
  const { patch, publish } = useDocumentOperation(props.id, props.type)

  // Only show for siteSettings document
  if (props.type !== 'siteSettings') {
    return null
  }

  return {
    label: 'Reset Theme',
    tone: 'critical' as const,
    onHandle: () => {
      // Confirm before reset
      const confirmed = window.confirm(
        'Reset all theme colors to defaults?\n\n' +
        'This will replace all current colors with the original theme.'
      )

      if (!confirmed) return

      // Patch document with default values
      patch.execute([
        { set: DEFAULT_THEME }
      ])

      // Auto-publish after reset
      publish.execute()

      // Show success message
      setTimeout(() => {
        window.alert('✅ Theme reset to defaults successfully!')
      }, 500)
    },
  }
}
