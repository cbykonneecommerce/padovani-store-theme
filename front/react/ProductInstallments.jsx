import React from 'react'
import { useProduct } from 'vtex.product-context'

function getFirstInstallmentOfTen(array) {
  const installment = array.find((item) => item.NumberOfInstallments === 10)
  return installment ? installment : array[0]
}

export default function ProductInstallments({ children }) {
  const { selectedItem } = useProduct()

  if (!selectedItem || !selectedItem?.sellers?.length) {
    return <></>
  }
  return children
}
