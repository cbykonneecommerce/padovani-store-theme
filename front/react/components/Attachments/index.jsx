import React, { useEffect, useState } from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import { formatAssemblyOptionsFromItemMetadata } from './utils'

const CSS_HANDLES = [
  'attachmentSelectButton',
  'attachmentButtonsContainer',
  'attachmentTitle',
  'attachmentMessageError',
]

export default function Attachments() {
  const {
    product,
    buyButton = {
      clicked: false,
    },
  } = useProduct()
  const { handles } = useCssHandles(CSS_HANDLES)

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

  const normalized = formatAssemblyOptionsFromItemMetadata(product.itemMetadata)

  useEffect(() => {
    const groupInputValues = {
      [selected.label]: selected.value.toUpperCase(),
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
      {normalized.map((item) => (
        <>
          <div className="flex align-center">
            <h3 className={handles.attachmentTitle}>{item.name}</h3>
            {!isSelected && buyButton.clicked && (
              <span className={handles.attachmentMessageError}>
                Selecione uma opção
              </span>
            )}
          </div>
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
        </>
      ))}
    </div>
  )
}
