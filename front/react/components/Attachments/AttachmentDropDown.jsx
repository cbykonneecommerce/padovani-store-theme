import { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Dropdown } from 'vtex.styleguide'

const CSS_HANDLES = ['attachmentSelectButton', 'attachmentDropdownContainer']

export default function AttachmentsDropdown({ setSelected, item }) {
  const { handles } = useCssHandles(CSS_HANDLES)
  const defaultValue = {
    id: 'selecione',
    label: 'selecione',
    value: '',
  }
  const [dropdownValue, setDropdownValue] = useState(defaultValue.value)
  const lowerTitle = item?.name?.toLowerCase()

  if (!lowerTitle.includes('batente') && !lowerTitle.includes('porta')) {
    return null
  }

  let newOptions = [
    {
      label: 'Escolha uma opção',
      value: '',
      disabled: true,
    },
  ]

  item?.options?.forEach((opt) => {
    newOptions.push({
      value: opt.value,
      label: opt.value,
    })
  })

  const handleFilter = (event) => {
    const { value } = event.target

    if (value === '') {
      return
    }

    const selectedData = item?.options?.find((opt) => opt.value === value)
    setDropdownValue(value)

    setSelected(selectedData)
  }

  return (
    <div className={handles.attachmentDropdownContainer}>
      <Dropdown
        options={newOptions}
        value={dropdownValue}
        onChange={(event) => handleFilter(event)}
      />
    </div>
  )
}
