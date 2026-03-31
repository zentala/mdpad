/**
 * InsertLinkPopover — popover for inserting markdown links at cursor.
 * Renders anchored to a button position. Inserts `[text](url)`.
 */
import { InsertFieldsPopover, type PopoverField } from './InsertFieldsPopover'

const FIELDS: PopoverField[] = [
  { key: 'url', label: 'URL', placeholder: 'https://...', required: true },
  { key: 'text', label: 'Text (optional)', placeholder: 'Link text' },
]

interface InsertLinkPopoverProps {
  anchorRect: DOMRect
  onInsert: (markdown: string) => void
  onClose: () => void
}

export function InsertLinkPopover({ anchorRect, onInsert, onClose }: InsertLinkPopoverProps) {
  return (
    <InsertFieldsPopover
      title="Insert Link"
      fields={FIELDS}
      anchorRect={anchorRect}
      onInsert={values => {
        const label = values.text?.trim() || values.url.trim()
        onInsert(`[${label}](${values.url.trim()})`)
      }}
      onClose={onClose}
    />
  )
}
