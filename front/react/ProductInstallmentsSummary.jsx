import React from 'react'
import { FormattedPrice } from 'vtex.formatted-price'
import { ProductSummaryContext } from 'vtex.product-summary-context'

function getFirstInstallmentOfTen(array) {
  const installment = array.find((item) => item.NumberOfInstallments === 10)
  return installment ? installment : array[0]
}

export default function ProductInstallmentsSummary({ children }) {
  const { selectedItem } = ProductSummaryContext.useProductSummary()

  if (!selectedItem || !selectedItem?.sellers?.length) {
    return <></>
  }

  if (selectedItem.unitMultiplier === 1) {
    return children
  }

  const [{ commertialOffer }] = selectedItem.sellers

  if (!commertialOffer) {
    return children
  }

  const installment = getFirstInstallmentOfTen(commertialOffer.Installments)

  if (!installment) {
    return children
  }

  return (
    <span
      class="vtex-product-price-1-x-installments vtex-product-price-1-x-installments--shelf"
      style={{
        display: 'flex',
        gap: '3px',
      }}
    >
      <span class="vtex-product-price-1-x-installmentsNumber vtex-product-price-1-x-installmentsNumber--shelf vtex-product-price-1-x-installmentsNumber--10 vtex-product-price-1-x-installmentsNumber--shelf--10">
        {installment.NumberOfInstallments}x de
      </span>
      <span class="vtex-product-price-1-x-installmentValue vtex-product-price-1-x-installmentValue--shelf">
        <span class="vtex-product-price-1-x-currencyContainer vtex-product-price-1-x-currencyContainer--shelf">
          <FormattedPrice
            value={commertialOffer.Price / installment.NumberOfInstallments}
          />
        </span>
      </span>{' '}
      sem juros
    </span>
  )
}
