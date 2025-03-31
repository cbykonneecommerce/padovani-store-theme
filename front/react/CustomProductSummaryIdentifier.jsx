import React from 'react'
import { ProductSummaryContext } from 'vtex.product-summary-context'

export default function CustomProductSummaryIdentifier() {
  const { selectedItem } = ProductSummaryContext.useProductSummary()

  if (!selectedItem) {
    return null
  }

  const id = selectedItem?.referenceId?.Value

  return (
    <span className="vtex-product-identifier-0-x-product-identifier vtex-product-identifier-0-x-product-identifier--skuReferenceId c-muted-1">
      <span className="vtex-product-identifier-0-x-product-identifier__label">
        Cod
      </span>
      <span className="vtex-product-identifier-0-x-product-identifier__separator">
        :{' '}
      </span>
      <span className="vtex-product-identifier-0-x-product-identifier__value">
        {id}
      </span>
    </span>
  )
}
