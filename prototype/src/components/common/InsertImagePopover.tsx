/**
 * InsertImagePopover — popover for inserting markdown images at cursor.
 * Inserts `![alt](url)`.
 */
import { InsertFieldsPopover, type PopoverField } from './InsertFieldsPopover'

const FIELDS: PopoverField[] = [
  { key: 'url', label: 'Image URL', placeholder: 'https://...image.png', required: true },
  { key: 'alt', label: 'Alt text (optional)', placeholder: 'Description' },
]

interface InsertImagePopoverProps {
  anchorRect: DOMRect
  onInsert: (markdown: string) => void
  onClose: () => void
}

export function InsertImagePopover({ anchorRect, onInsert, onClose }: InsertImagePopoverProps) {
  return (
    <InsertFieldsPopover
      title="Insert Image"
      fields={FIELDS}
      anchorRect={anchorRect}
      onInsert={values => {
        const alt = values.alt?.trim() || 'image'
        onInsert(`![${alt}](${values.url.trim()})`)
      }}
      onClose={onClose}
    />
  )
}
