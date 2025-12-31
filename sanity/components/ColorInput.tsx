import { useCallback, useState, useEffect, useRef } from 'react'
import { set } from 'sanity'
import { Stack, Text, Card, Popover, Box, Flex } from '@sanity/ui'
import { Sketch } from '@uiw/react-color'
import type { StringInputProps } from 'sanity'

/**
 * Custom Color Input Component for Sanity Studio
 *
 * Uses @uiw/react-color for visual color picking
 * Compatible with Sanity v4
 *
 * Features:
 * - Color dot preview (click to open picker)
 * - Visual color wheel (Sketch picker)
 * - Hex input field
 * - RGB/HSL sliders
 * - DevTools-like UX
 * - Click outside to close
 */
export function ColorInput(props: StringInputProps) {
  const { onChange, value = '#FFFFFF' } = props
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (color: { hex: string }) => {
      onChange(set(color.hex.toUpperCase()))
    },
    [onChange]
  )

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Don't close if clicking trigger or picker
      if (
        (triggerRef.current && triggerRef.current.contains(target)) ||
        (pickerRef.current && pickerRef.current.contains(target))
      ) {
        return
      }

      setIsOpen(false)
    }

    // Add delay to prevent immediate close on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <Stack space={3}>
      <Popover
        content={
          <Card padding={4} ref={pickerRef} style={{ minWidth: '280px' }}>
            <Stack space={4}>
              <Sketch
                color={value as string}
                onChange={handleChange}
                disableAlpha={true}
                style={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              />
              <Flex justify="space-between" align="center">
                <Text size={2} weight="semibold" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                  {value}
                </Text>
                <Text
                  size={1}
                  style={{
                    cursor: 'pointer',
                    color: '#EB9947',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(235, 153, 71, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Đóng
                </Text>
              </Flex>
            </Stack>
          </Card>
        }
        open={isOpen}
        portal
      >
        <Flex align="center" gap={3} ref={triggerRef}>
          {/* Larger color preview with gradient border */}
          <Box
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: value as string,
              border: '3px solid transparent',
              backgroundImage: `linear-gradient(${value}, ${value}), linear-gradient(135deg, #EB9947 0%, #D68331 100%)`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)'
            }}
          />

          {/* Hex value with better styling */}
          <Flex direction="column" gap={1}>
            <Text
              size={2}
              weight="bold"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '1px',
                color: '#1B140E'
              }}
            >
              {value}
            </Text>
            <Text size={0} muted>
              Click để chỉnh sửa
            </Text>
          </Flex>
        </Flex>
      </Popover>

      {/* Description is already shown by Sanity Studio - removed to prevent duplication */}
    </Stack>
  )
}
