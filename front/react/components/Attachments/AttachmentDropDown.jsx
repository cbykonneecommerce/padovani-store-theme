import { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Dropdown } from 'vtex.styleguide'

const CSS_HANDLES = ['attachmentSelectButton', 'attachmentDropdownContainer']

export default function AttachmentsDropdown({ setSelected, item }) {
  const { handles } = useCssHandles(CSS_HANDLES)
  const defaultValue = item?.options[0]
  const [dropdownValue, setDropdownValue] = useState(defaultValue.value)
  const lowerTitle = item?.name?.toLowerCase()

  if (!lowerTitle.includes('batente') && !lowerTitle.includes('porta')) {
    return null
  }

  const newOptions = item?.options?.map((opt) => {
    return {
      value: opt.value,
      label: opt.value,
    }
  })

  useEffect(() => {
    setSelected(defaultValue)
  }, [])

  const handleFilter = (event) => {
    const { value } = event.target
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
