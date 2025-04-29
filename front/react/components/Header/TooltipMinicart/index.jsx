import React, { useEffect, useState } from 'react'
import { FormattedPrice } from 'vtex.formatted-price'
import { ItemContext } from 'vtex.product-list'
import styles from '../../../styles/css/header.tooltip-minicart.css'
import IconAlert from './IconAlert'

const TooltipMinicart = () => {
  const { useItemContext } = ItemContext
  const { item, loading } = useItemContext()
  const [hasPorcel, setHasPorcel] = useState(false)
  const prodId = item.productId
  const basePrice = item.price / 100

  async function getInfoProd() {
    fetch('/api/catalog_system/pub/products/search?fq=productId:' + prodId)
      .then((response) => response.json())
      .then((response) => {
        setHasPorcel(response[0]['Peças por Caixa'] ? true : false)
      })
  }

  useEffect(() => {
    getInfoProd()
  }, [item, hasPorcel])

  if (loading || !hasPorcel) {
    return <></>
  }

  return (
    <div className={styles.WrapperToltipInfos}>
      <div className={styles.InfosMetro}>
        <span>
          {item.unitMultiplier} {item.measurementUnit}
        </span>
      </div>

      <div className={styles.Tooltip}>
        <span className="c-on-base pointer">
          <IconAlert />
        </span>

        <div className={styles.TooltipMenssage}>
          Cada caixa possui{' '}
          <strong>
            {' '}
            {item.unitMultiplier} {item.measurementUnit}{' '}
          </strong>{' '}
          onde {item.measurementUnit === 'un' ? 'cada' : 'o'}{' '}
          <strong>
            {item.measurementUnit === 'un' ? ' unidade ' : item.measurementUnit}
          </strong>{' '}
          sai por
          <strong>
            {' '}
            <FormattedPrice value={basePrice} />
          </strong>
        </div>
      </div>
    </div>
  )
}

export default TooltipMinicart
