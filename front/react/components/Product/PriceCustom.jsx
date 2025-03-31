import React from 'react'
import { useProduct } from 'vtex.product-context'
import { FormattedPrice } from 'vtex.formatted-price'

const PriceCustom = () => {
  const context = useProduct()
  const priceProduct = context?.product?.items[0].sellers[0].commertialOffer.Price

  return (
    <>
      <span className='vtex-product-price-1-x-sellingPrice vtex-product-price-1-x-sellingPrice--pdp vtex-product-price-1-x-sellingPrice--hasListPrice vtex-product-price-1-x-sellingPrice--pdp--hasListPrice'>
        <FormattedPrice
          value={priceProduct}
        />
      </span>
    </>
  )
}

export default PriceCustom
