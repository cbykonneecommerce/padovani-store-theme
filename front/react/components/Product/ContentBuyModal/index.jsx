import React, { useEffect, useState } from 'react'
import { FormattedPrice } from 'vtex.formatted-price'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { usePixel } from 'vtex.pixel-manager'
import { useProduct, useProductDispatch } from 'vtex.product-context'
import { Checkbox, NumericStepper } from 'vtex.styleguide'
import styles from '../../../styles/css/product.content-buy-modal.css'
import PackagingPrice from './PackagingPrice'

const ContentBuyModal = () => {
  useEffect(() => {
    window.dataLayer?.push({ event: 'CalculadoraPiso' })
  }, [])

  const [quantity, setQuantity] = useState(1)
  const [isChecked, setIsChecked] = useState(false)
  const prodContext = useProduct()
  const { addItems } = useOrderItems()
  const dispatch = useProductDispatch()
  const { push } = usePixel()
  const quantitySel = prodContext?.selectedQuantity
  const multiplier = prodContext?.product?.items[0]?.unitMultiplier
  const isAvaible =
    prodContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity >
    0
  const avaibleQty =
    prodContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity
  const basePrice =
    prodContext?.selectedItem?.sellers[0]?.commertialOffer?.Price

  const handleCheckBoxClick = (checkboxIsChecked) => {
    if (checkboxIsChecked) {
      dispatch({
        type: 'SET_QUANTITY',
        args: { quantity: quantitySel + 1 },
      })
      setQuantity(quantity + 1)
    } else {
      dispatch({
        type: 'SET_QUANTITY',
        args: { quantity: quantitySel - 1 },
      })
      setQuantity(quantity - 1)
    }
  }

  function addToCart(sku, quantity, seller) {
    if (!isAvaible) return

    const products = [
      {
        id: sku,
        index: 0,
        quantity: quantity,
        seller: seller,
        options: [],
      },
    ]

    push({ event: 'addToCart' })
    addItems(products)
  }

  return (
    <div className={styles.ContentWrapModal}>
      <div className={styles.ContentModalWarnning}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.29 3.86001L1.82002 18C1.64539 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5468 2.53773 20.7239C2.83871 20.901 3.18082 20.9962 3.53002 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.4471 18.6453 22.3547 18.3024 22.18 18L13.71 3.86001C13.5318 3.56611 13.2807 3.32313 12.9812 3.15449C12.6817 2.98585 12.3438 2.89726 12 2.89726C11.6563 2.89726 11.3184 2.98585 11.0188 3.15449C10.7193 3.32313 10.4683 3.56611 10.29 3.86001Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 9V13"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 17H12.01"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <p>
          <strong>Atenção: </strong> Produto vendido por caixa, cada uma possui
          <strong style={{ marginLeft: '2.5px' }}>
            {' '}
            {multiplier} m²{' '}
          </strong>{' '}
          onde o <strong> m² </strong> sai por
          <strong style={{ marginLeft: '2.5px' }}>
            {' '}
            <FormattedPrice value={basePrice} />{' '}
          </strong>
        </p>
      </div>

      <div className={styles.ContentModalQty}>
        <NumericStepper
          minValue={1}
          maxValue={avaibleQty}
          unitMultiplier={multiplier}
          value={quantity}
          onChange={(event) => {
            if (event.type == 'change') {
              setQuantity(event.value + 1)
            } else {
              setQuantity(event.value)
            }
          }}
        />

        <div className={styles.ContentModalWrapCheckBox}>
          <Checkbox
            checked={isChecked}
            partial={true}
            id="checkbox-diagonal"
            name="checkbox-diagonal"
            value={isChecked}
            onChange={() => {
              handleCheckBoxClick(!isChecked)
              setIsChecked(!isChecked)
            }}
          />
          <label for="checkbox-diagonal">
            <b>+10%</b> Adicional para recortes e rodapés
          </label>
        </div>
      </div>
      <div className={styles.ContentModalTotal}>
        <strong>Total da Compra</strong>

        <PackagingPrice qty={quantity} isFixed={false} />

        <span className={styles.ContentModalInfoQty}>
          {`${quantity} caixa(s)`} de
          <strong style={{ marginLeft: '2.5px' }}>{multiplier} m²</strong>
        </span>
      </div>

      <a
        href="/checkout/#/cart"
        className={styles.ContentModalBuyButton}
        onClick={(event) => {
          event.stopPropagation()
          addToCart(
            prodContext?.selectedItem?.itemId,
            quantity,
            prodContext?.selectedItem?.sellers[0]?.sellerId
          )
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_4_318)">
            <path
              d="M0.155592 1.31011C0.637617 0.310423 1.54165 0.544871 2.41567 0.891854C3.24656 1.22196 4.11495 1.46016 4.97772 1.70023C5.83674 1.94031 6.23624 2.4636 6.30939 3.362C6.45193 5.12318 6.30939 4.87372 8.00304 5.05941C12.8983 5.59207 17.7899 6.15475 22.6833 6.71367C23.6529 6.82433 24.1218 7.39826 23.9718 8.37732C23.6886 10.2098 23.3622 12.0347 23.0246 13.8578C22.8446 14.8331 22.0981 14.9756 21.2597 14.9738C17.381 14.9663 13.5041 14.97 9.62543 14.97C8.85268 14.97 8.08182 14.97 7.24531 14.97C7.14965 15.5102 7.06713 15.9884 6.96397 16.5661H8.06119C12.0937 16.5661 16.1262 16.5661 20.1606 16.5661C20.4082 16.5661 20.6595 16.553 20.9052 16.5793C21.5935 16.6543 21.9874 17.0857 22.0249 17.7365C22.0624 18.3854 21.7361 18.8675 21.0459 18.9988C20.7739 19.0494 20.4926 19.0738 20.215 19.0738C15.4998 19.0775 10.7845 19.0813 6.06931 19.0738C4.46944 19.0719 3.89176 18.4867 4.31377 16.9394C5.00586 14.4073 4.63449 11.909 4.39067 9.39389C4.23687 7.82402 4.01742 6.25791 3.92177 4.68429C3.88613 4.09536 3.62543 3.92468 3.15278 3.73712C2.13996 3.33762 1.15528 2.86497 0.157467 2.42046C-0.0394693 2.31542 -0.063852 1.69461 0.157467 1.30448L0.155592 1.31011Z"
              fill="white"
            />
            <path
              d="M7.34291 23.4064C8.35702 23.4064 9.17911 22.5843 9.17911 21.5702C9.17911 20.5561 8.35702 19.734 7.34291 19.734C6.32881 19.734 5.50671 20.5561 5.50671 21.5702C5.50671 22.5843 6.32881 23.4064 7.34291 23.4064Z"
              fill="white"
            />
            <path
              d="M18.542 23.4064C19.5561 23.4064 20.3782 22.5843 20.3782 21.5702C20.3782 20.5561 19.5561 19.734 18.542 19.734C17.5279 19.734 16.7058 20.5561 16.7058 21.5702C16.7058 22.5843 17.5279 23.4064 18.542 23.4064Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_4_318">
              <rect
                width="24"
                height="22.8128"
                fill="white"
                transform="translate(0 0.593628)"
              />
            </clipPath>
          </defs>
        </svg>
        Comprar
      </a>
    </div>
  )
}

export default ContentBuyModal
