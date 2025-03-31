import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import styles from '../../styles/css/product.css'
import Skeleton from '../../UI/Skeleton'

const BuyButtonWhatsApp = () => {
  const context = useProduct()
  const [link, setLink] = useState(null)

  useEffect(() => {
    const reference = context?.product?.productReference
    const productName = context?.product?.productName
    const setMessage = `Olá, gostaria de uma informação sobre o produto ${productName} - Ref: ${reference}`

    setLink(
      `https://api.whatsapp.com/send?phone=551140137009&text=${setMessage}`
    )
  }, [context?.product])

  return (
    <>
      <Skeleton height={70}>
        <div className={styles.BuyButtonJacuzziValidator}>
          <a
            style={{
              background: 'rgb(74, 184, 7)',
              color: '#fff',
            }}
            href={link}
            target="_blank"
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.376 40.5134C11.3766 37.4227 10.2145 33.7384 10.2145 29.7855C10.2145 18.866 19.0805 10 30 10C40.9195 10 49.7854 18.866 49.7854 29.7855C49.7854 40.705 40.9195 49.571 30 49.571C26.299 49.571 22.8355 48.5525 19.8719 46.7823L10.2145 50L13.376 40.5134Z"
                fill="#F3F3F3"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.0769 38.9639C15.2317 36.373 14.1466 33.2053 14.1466 29.7855C14.1466 21.0362 21.2506 13.9321 30 13.9321C38.7493 13.9321 45.8534 21.0362 45.8534 29.7855C45.8534 38.5349 38.7493 45.6368 30 45.6368C26.6885 45.6368 23.6145 44.6205 21.0694 42.8814L15.1088 44.8683L17.0769 38.9639Z"
                fill="#00A82D"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.2389 33.901C22.898 31.0394 21.336 27.5363 20.8465 23.7375C20.7153 22.6795 21.0673 21.6173 21.8067 20.8488C22.546 20.0803 23.5936 19.6867 24.6558 19.7762L24.7578 19.7866C24.7578 19.7866 25.9262 20.099 26.5656 20.2719C26.8197 20.3406 27.0217 20.5301 27.1071 20.778C27.3945 21.6319 28.0735 23.6375 28.3942 24.581C28.4983 24.8871 28.4025 25.2266 28.1568 25.4349C27.6715 25.8431 26.8697 26.5179 26.3698 26.9406C26.1012 27.1676 26.0158 27.5446 26.1616 27.8633C26.7426 29.1295 27.4841 30.3125 28.3629 31.383C29.2668 32.4285 30.3061 33.3595 31.4557 34.1467C31.7473 34.3446 32.1326 34.3237 32.4013 34.0967C32.9032 33.676 33.705 33.0012 34.1882 32.593C34.436 32.3848 34.7859 32.3494 35.0713 32.5035C35.946 32.9783 37.8079 33.9864 38.5993 34.4154C38.8305 34.5403 38.9846 34.7736 39.0075 35.0339C39.0679 35.6941 39.1804 36.8979 39.1804 36.8979L39.1721 37C39.0804 38.0622 38.516 39.0285 37.633 39.6263C36.7499 40.2261 35.644 40.3927 34.6235 40.0844C30.933 38.9494 27.7236 36.7917 25.2952 33.9676L25.2389 33.901Z"
                fill="#F3F3F3"
              />
            </svg>
            <span>Comprar pelo whatsapp</span>
          </a>
        </div>
      </Skeleton>
    </>
  )
}

export default BuyButtonWhatsApp
