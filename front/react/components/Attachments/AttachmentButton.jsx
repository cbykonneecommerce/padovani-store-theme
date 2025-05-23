import { applyModifiers, useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['attachmentSelectButton', 'attachmentButtonsContainer']

export default function AttachmentsButton({ setSelected, selected, item }) {
  const { handles } = useCssHandles(CSS_HANDLES)

  if (!item?.name?.includes('bomba')) {
    return null
  }

  return (
    <div className={handles.attachmentButtonsContainer}>
      {item.options.map((option) => (
        <button
          key={option.value}
          onClick={() =>
            setSelected({
              id: option.id,
              value: option.value,
              label: option.label,
            })
          }
          className={applyModifiers(
            handles.attachmentSelectButton,
            selected.value === option.value ? 'is-active' : ''
          )}
        >
          {option.value}
        </button>
      ))}
    </div>
  )
}
