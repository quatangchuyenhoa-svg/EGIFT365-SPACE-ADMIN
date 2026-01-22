'use client'

import React, { useState } from 'react'
import { Button, Flex, useToast, Spinner, Card } from '@sanity/ui'
import { HomeIcon, SyncIcon, LaunchIcon } from '@sanity/icons'
import { type NavbarProps } from 'sanity'

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://space.egift365.vn'

/**
 * Custom Navbar Component
 *
 * Wrap default Navbar và thêm custom actions:
 * - "Sync Content": Trigger on-demand revalidation
 * - "Back to Home": Navigate về trang chủ
 */
export function NavbarActions(props: NavbarProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const toast = useToast()

  const handleBackToHome = () => {
    window.location.href = '/'
  }

  const handleOpenClient = () => {
    window.open(CLIENT_URL, '_blank')
  }

  // Trigger revalidation API để cập nhật content trên website ngay lập tức
  const handleSyncContent = async () => {
    setIsSyncing(true)

    try {
      // Gọi API proxy trong admin để revalidate (secret được giữ ở server-side)
      const response = await fetch('/api/sync-content', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast.push({
          status: 'success',
          title: 'Đồng bộ thành công!',
          description: 'Cache đã được xóa. Refresh trang client để xem thay đổi.',
          duration: 5000,
        })
      } else {
        throw new Error(data.error || 'Sync failed')
      }
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Đồng bộ thất bại',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đồng bộ.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card style={{ width: '100%' }}>
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        {/* Render default navbar */}
        {props.renderDefault(props)}

        {/* Custom actions */}
        <Flex align="center" gap={2} paddingRight={3}>
          <Button
            icon={isSyncing ? Spinner : SyncIcon}
            mode="ghost"
            tone="positive"
            onClick={handleSyncContent}
            disabled={isSyncing}
            title="Sync Content - Cache sẽ được xóa, refresh trang client để xem thay đổi"
            text={isSyncing ? 'Syncing...' : 'Sync'}
            fontSize={1}
            padding={2}
          />
          <Button
            icon={LaunchIcon}
            mode="ghost"
            tone="default"
            onClick={handleOpenClient}
            title="Mở trang Client"
            text="Client"
            fontSize={1}
            padding={2}
          />
          <Button
            icon={HomeIcon}
            mode="ghost"
            tone="primary"
            onClick={handleBackToHome}
            title="Back to Home"
            text="Home"
            fontSize={1}
            padding={2}
          />
        </Flex>
      </Flex>
    </Card>
  )
}
