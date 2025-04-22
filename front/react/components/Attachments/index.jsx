import React, { useEffect, useState } from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import { formatAssemblyOptionsFromItemMetadata } from './utils'

const CSS_HANDLES = ['attachmentSelectButton', 'attachmentButtonsContainer']

export default function Attachments() {
  const { product } = useProduct()
  const { handles } = useCssHandles(CSS_HANDLES)

  const [selected, setSelected] = useState({
    id: '',
    value: '',
  })
  const dispatch = useProductDispatch()
  const normalized = formatAssemblyOptionsFromItemMetadata(product.itemMetadata)

  if (!product.itemMetadata) {
    return null
  }

  useEffect(() => {
    const groupInputValues = {
      [selected.id]: toUpperCase(selected.value),
    }

    if (!groupInputValues[selected.id]) {
      return
    }

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

  return (
    <div className="mt-4">
      {normalized.map((item) => (
        <>
          <p className="font-semibold text-sm mb-2 uppercase text-gray-700">
            {item.name}
          </p>

          <div className={handles.attachmentButtonsContainer}>
            {item.options.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setSelected({
                    id: option.id,
                    value: option.value,
                  })
                }
                className={applyModifiers(
                  handles.attachmentSelectButton,
                  selected.value === option.value ? 'is-active' : ''
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ))}
    </div>
  )
}
