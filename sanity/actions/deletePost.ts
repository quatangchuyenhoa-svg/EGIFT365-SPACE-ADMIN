import { DocumentActionComponent, useDocumentOperation } from 'sanity'
import { TrashIcon } from '@sanity/icons'

/**
 * Custom Delete Action for Knowledge and Concept Hubs
 * Makes the delete option more prominent and provides clear confirmation in Vietnamese
 */
export const DeletePostAction: DocumentActionComponent = (props) => {
    const { delete: deleteOp } = useDocumentOperation(props.id, props.type)

    return {
        label: '🔴 Xóa bài viết',
        tone: 'critical' as const,
        icon: TrashIcon,
        onHandle: () => {
            const confirmed = window.confirm(
                'Bạn có chắc chắn muốn xóa bài viết này?\n\nHành động này không thể hoàn tác và bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.'
            )

            if (confirmed) {
                deleteOp.execute()
                props.onComplete()
            }
        },
    }
}
