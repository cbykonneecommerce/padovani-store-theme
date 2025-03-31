import React, { useEffect, useState } from 'react'
import { useProduct } from "vtex.product-context";
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import styles from '../../../styles/css/shelf.price-from.css'

const PriceFrom = (props) => {

  const product = useProduct()
  const [price, setPrice] = useState()
  const [selectSku, setSelectSku] = useState()

  const [quantity, setQuantity] = useState(1)

  const OrderForm = useOrderForm()
  const {
    addItems,
    removeItem
  } = useOrderItems()

  const options = {
    allowedOutdatedData: ['paymentData'],
  }

  const addToCart = (sku, quantity, seller) => {

    const products = [{
      id: sku, //
      index: 0,
      quantity: quantity,//
      seller: seller,//
      options: []
    }]

    addItems(products, {
      ...options,
    })

    setTimeout(() => {
      const button = document.querySelector('.vtex-minicart-2-x-openIconContainer .vtex-button')
      if (button) button.click()
    }, 1500)
  }

  const addProduct = () => {
    setQuantity(quantity + 1)
  }

  const removePoduct = () => {
    quantity > 1 && setQuantity(quantity - 1)
  }

  useEffect(() => {
    const item = product.product.items.reduce((a, b) => {
      if (b.sellers[0].commertialOffer.Price < a.sellers[0].commertialOffer.Price) a = b;
      return a;
    });
    setPrice(item)
    setSelectSku(item)
  }, [product]);

  return (
    <div className={styles.containerInfoShelf}>
      {props.children[0]}
      {
        product?.product?.items?.length > 1 ?
          <>
            <p className={styles.textFrom}>A partir de</p>
            <p className={styles.textPrice}>R$ {price?.sellers[0]?.commertialOffer?.Price.toString().replace(".", ",")}</p>
            <span className={styles.textInstallment}>{`Em até ${price?.sellers[0]?.commertialOffer?.Installments[0]?.NumberOfInstallments}x de ${price?.sellers[0]?.commertialOffer?.Installments[0]?.Value.toString().replace(".", ",")} sem juros.`}</span>
            <div className={styles.buttonCustomShelf}>
              <div className={styles.buttonContainer}>
                <a href={`javascript:void(0)`} className={styles.buttonCustomRemove} onClick={ event => { event.stopPropagation(); removePoduct() }}>-</a>
                <span>{quantity}</span>
                <a href={`javascript:void(0)`} className={styles.buttonCustomAdd} onClick={ event => { event.stopPropagation(); addProduct() }}>+</a>
              </div>
              <div className={styles.buttomCustomPurchase}>
                <a href={`javascript:void(0)`}
                  onClick={event => { event.stopPropagation(); addToCart(selectSku.itemId, quantity, selectSku?.sellers[0]?.sellerId) }}
                >
                  comprar
                </a>
              </div>
            </div>
          </>
          :
          <>
            {props.children[1]}
            {props.children[2]}
            {props.children[3]}
          </>
      }

    </div >

  )
}
export default PriceFrom
