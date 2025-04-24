import React from 'react'
import { useProduct } from 'vtex.product-context'
import './global.css'

function getFirstInstallmentOfTen(array) {
  const installment = array.find((item) => item.NumberOfInstallments === 10)
  return installment ? installment : array[0]
}

export default function ProductInstallments({ children }) {
  const { selectedItem, product } = useProduct()
  const multiplier = product?.items[0]?.unitMultiplier
  const basePrice = selectedItem?.sellers[0]?.commertialOffer?.Price

  const formatarParaBRL = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valor)
  }

  const boxPrice = formatarParaBRL(basePrice * multiplier)

  if (!selectedItem || !selectedItem?.sellers?.length) {
    return <></>
  }

  const productIsPiecesPerBox = product?.properties.find(
    (prop) => prop.name === 'Peças por Caixa'
  )

  if (productIsPiecesPerBox) {
    return (
      <div>
        <span className="custom-perBox-price">
          <strong>{boxPrice} </strong>a caixa
        </span>
        <span className="custom-installments">
          Pague em até <strong>10x sem juros </strong>
          nos cartões{' '}
        </span>
      </div>
    )
  }

  return children
}
