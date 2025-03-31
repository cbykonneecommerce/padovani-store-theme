import React from 'react'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import './global.css'

export default function FlagLancamento() {
  const { product } = ProductSummaryContext.useProductSummary()
  const isLancamento = product.productClusters.some((item) => item.id === '695')
  const isOutlet = product.productClusters.some((item) => item.id === '611')
  const isFrete = product.productClusters.some((item) => item.id === '347')

  if (isLancamento) {
    return (
      <div className="badge-lancamentos--2024">
        <span>
          Lançamentos <b>2024</b>
        </span>
      </div>
    )
  }

  if (isOutlet) {
    return (
      <div className="badge-outlet">
        <span>
          Outlet
        </span>
      </div>
    )
  }

  if (isFrete) {
    return (
      <div className="badge-frete">
        <span>
          Frete Grátis
        </span>
      </div>
    )
  }

  return null
}
