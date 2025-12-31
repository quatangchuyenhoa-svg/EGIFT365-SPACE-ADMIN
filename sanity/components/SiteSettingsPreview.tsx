import { Card, Stack, Grid, Box, Text, Flex } from '@sanity/ui'
import type { PreviewProps } from 'sanity'

interface ColorSwatchProps {
  color: string
  label: string
}

const ColorSwatch = ({ color, label }: ColorSwatchProps) => (
  <Flex direction="column" gap={2}>
    <Box
      style={{
        width: '100%',
        height: '64px',
        borderRadius: '8px',
        backgroundColor: color,
        border: '2px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    />
    <Stack space={1}>
      <Text size={1} weight="semibold" style={{ fontFamily: 'monospace' }}>
        {color}
      </Text>
      <Text size={0} muted>
        {label}
      </Text>
    </Stack>
  </Flex>
)

/**
 * Custom Preview Component for Site Settings
 *
 * Displays all 14 colors organized by category
 * with visual swatches and descriptions
 */
export function SiteSettingsPreview(props: PreviewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const document = (props as any).value || props

  if (!document) {
    return (
      <Card padding={4}>
        <Text muted>Đang tải...</Text>
      </Card>
    )
  }

  const {
    // Backgrounds (6)
    headerBg = '#FFFFFF',
    bodyBg = '#FDFBF7',
    sectionBg = '#F8F5F1',
    footerBg = '#69372A',
    surfaceBg = '#FFFFFF',
    overlayBg = '#F5F1EB',
    // Buttons (4)
    buttonPrimaryBg = '#EB9947',
    buttonPrimaryHover = '#D68331',
    buttonOutlineText = '#EB9947',
    buttonOutlineBorder = '#EB9947',
    // Texts (4)
    textForeground = '#1B140E',
    textHeading = '#3D2817',
    textBody = '#69372A',
    textHover = '#D68331',
  } = document

  return (
    <Card padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" gap={2}>
          <Text size={3} weight="bold" style={{ color: '#EB9947' }}>
            🎨 Bảng Màu Trang
          </Text>
        </Flex>

        {/* Backgrounds */}
        <Stack space={3}>
          <Text size={2} weight="semibold">
            🎭 Màu Nền (6)
          </Text>
          <Grid columns={3} gap={3}>
            <ColorSwatch color={headerBg} label="Header" />
            <ColorSwatch color={bodyBg} label="Body" />
            <ColorSwatch color={sectionBg} label="Section" />
            <ColorSwatch color={footerBg} label="Footer" />
            <ColorSwatch color={surfaceBg} label="Surface" />
            <ColorSwatch color={overlayBg} label="Overlay" />
          </Grid>
        </Stack>

        {/* Buttons */}
        <Stack space={3}>
          <Text size={2} weight="semibold">
            🔘 Màu Nút Bấm (4)
          </Text>
          <Grid columns={2} gap={3}>
            <ColorSwatch color={buttonPrimaryBg} label="Primary" />
            <ColorSwatch color={buttonPrimaryHover} label="Primary Hover" />
            <ColorSwatch color={buttonOutlineText} label="Outline Text" />
            <ColorSwatch color={buttonOutlineBorder} label="Outline Border" />
          </Grid>
        </Stack>

        {/* Texts */}
        <Stack space={3}>
          <Text size={2} weight="semibold">
            ✍️ Màu Chữ (4)
          </Text>
          <Grid columns={2} gap={3}>
            <ColorSwatch color={textForeground} label="Foreground" />
            <ColorSwatch color={textHeading} label="Heading" />
            <ColorSwatch color={textBody} label="Body" />
            <ColorSwatch color={textHover} label="Link Hover" />
          </Grid>
        </Stack>

        {/* Summary */}
        <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: '#FFF9F0' }}>
          <Text size={1} muted>
            📊 Tổng: <strong>14 màu admin</strong> → 50 design tokens
          </Text>
        </Card>
      </Stack>
    </Card>
  )
}
