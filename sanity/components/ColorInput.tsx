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
          <Card padding={3} ref={pickerRef}>
            <Stack space={3}>
              <Sketch
                color={value as string}
                onChange={handleChange}
                disableAlpha={true}
                style={{ width: '100%' }}
              />
              <Flex justify="flex-end">
                <Text
                  size={1}
                  style={{ cursor: 'pointer', color: '#999' }}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Text>
              </Flex>
            </Stack>
          </Card>
        }
        open={isOpen}
        portal
      >
        <Flex align="center" gap={3} ref={triggerRef}>
          {/* Color preview dot */}
          <Box
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: value as string,
              border: '2px solid #e0e0e0',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />

          {/* Hex value text */}
          <Text size={1} weight="medium" style={{ fontFamily: 'monospace' }}>
            {value}
          </Text>
        </Flex>
      </Popover>

      {/* Description is already shown by Sanity Studio - removed to prevent duplication */}
    </Stack>
  )
}
