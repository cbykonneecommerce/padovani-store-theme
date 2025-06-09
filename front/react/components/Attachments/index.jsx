import { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import AttachmentsButton from './AttachmentButton'
import AttachmentsDropdown from './AttachmentDropDown'
import { formatAssemblyOptionsFromItemMetadata } from './utils'

const CSS_HANDLES = ['attachmentTitle', 'attachmentMessageError']

export default function Attachments() {
  const {
    product,
    buyButton = {
      clicked: false,
    },
  } = useProduct()
  const { handles } = useCssHandles(CSS_HANDLES)
  console.log('🚀 ~ Attachments ~ useProduct():', useProduct())

  const [selected, setSelected] = useState({
    id: '',
    value: '',
    label: '',
  })
  const [isSelected, setIsSelected] = useState(false)

  const dispatch = useProductDispatch()

  if (!product?.itemMetadata) {
    return null
  }

  const [normalized] = formatAssemblyOptionsFromItemMetadata(
    product.itemMetadata
  )
  console.log('🚀 ~ Attachments ~ normalized:', normalized)

  useEffect(() => {
    const groupInputValues = {
      [selected.label]: selected.value,
    }

    if (!groupInputValues[selected.label]) {
      return
    }

    setIsSelected(true)

    dispatch({
      type: 'SET_ASSEMBLY_OPTIONS',
      args: {
        groupId: selected.id,
        groupItems: [],
        groupInputValues,
        isValid: true,
      },
    })
  }, [selected])

  useEffect(() => {
    dispatch({
      type: 'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
      args: {
        allSelected: !!selected?.id,
      },
    })
  }, [dispatch, selected])

  return (
    <div>
      <>
        <div className="flex align-center">
          <h3 className={handles.attachmentTitle}>{normalized.name}</h3>
          {!isSelected && buyButton.clicked && (
            <span className={handles.attachmentMessageError}>
              Selecione uma opção
            </span>
          )}
        </div>
        <AttachmentsButton
          setSelected={setSelected}
          selected={selected}
          item={normalized}
        />
        <AttachmentsDropdown setSelected={setSelected} item={normalized} />
      </>
    </div>
  )
}
