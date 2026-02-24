import React from 'react'
import { Button, Stack, Text, Card } from '@sanity/ui'
import { TrashIcon } from '@sanity/icons'
import { useDocumentOperation, useFormValue } from 'sanity'

export function DeleteButtonInput() {
    // Get document ID and Type from the form state
    const docId = useFormValue(['_id']) as string
    const docType = useFormValue(['_type']) as string

    const { delete: deleteOp } = useDocumentOperation(docId?.replace('drafts.', ''), docType)

    const handleDelete = () => {
        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn xóa bài viết này?\n\nHành động này không thể hoàn tác và bài viết sẽ bị xóa vĩnh viễn.'
        )

        if (confirmed) {
            deleteOp.execute()
        }
    }

    return (
        <Card padding={3} border tone="critical" radius={2}>
            <Stack space={3}>
                <Text size={1} weight="semibold">⚠️ Khu vực nguy hiểm</Text>
                <Text size={1} muted>Hành động này sẽ xóa bài viết này vĩnh viễn khỏi hệ thống.</Text>
                <Button
                    fontSize={2}
                    icon={TrashIcon}
                    padding={3}
                    text="Xóa bài viết này ngay"
                    tone="critical"
                    onClick={handleDelete}
                    style={{ cursor: 'pointer' }}
                />
            </Stack>
        </Card>
    )
}
