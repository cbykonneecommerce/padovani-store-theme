import { useLayoutEffect, useState } from 'react'

import { useProduct } from 'vtex.product-context'
import styles from '../../styles/css/product.css'

const Stock = (props) => {
  const context = useProduct()
  const [delay, setDelay] = useState(null)

  useLayoutEffect(() => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: context.selectedItem.itemId,
            quantity: 1,
            seller: '1',
          },
        ],
        country: 'BRA',
        postalCode: '03449-000',
      }),
    }

    fetch('/api/checkout/pub/orderForms/simulation', options)
      .then((response) => response.json())
      .then((response) => {
        response.logisticsInfo[0].slas.map((find) => {
          if (
            find.deliveryChannel == 'pickup-in-point' &&
            find.deliveryIds[0].warehouseId != '1_1'
          )
            setDelay(find.shippingEstimate.replace('bd', ''))
        })
      })
  })

  if (context == null) return null

  const quantity =
    context.selectedItem.sellers[0].commertialOffer.AvailableQuantity

  return (
    <div className={styles.stock}>
      {delay && delay > 0 ? (
        <>
          Disponível em <i>{delay} dias</i>
        </>
      ) : (
        <>
          Disponibilidade <i>imediata</i>
          {quantity < props.maxItens && (
            <span>
              <strong>Aproveite!</strong> Resta apenas <i>{quantity}</i> unidade
            </span>
          )}
        </>
      )}
    </div>
  )
}

Stock.schema = {
  title: 'Disponibilidade',
  type: 'object',
  properties: {
    maxItens: {
      title: 'Quantidade máxima',
      type: 'string',
      description:
        'Será exibido apenas itens com quantidade em estoque inferior ao cadastrado nesse campo.',
    },
  },
}

export default Stock
