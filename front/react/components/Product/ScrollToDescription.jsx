import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import styles from '../../styles/css/product.scrollToDescription.css'

const ScrollToDescription = () => {
  if (!canUseDOM) return <></>

  const handleBackTop = () => {
    const elements = document.getElementsByClassName(
      'vtex-flex-layout-0-x-flexRow--description-both'
    )

    if (elements.length) {
      const element = elements.item(0)

      const distanceFromTop =
        element.getBoundingClientRect().top + window.scrollY

      window.scroll({ top: distanceFromTop, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={styles.ScrollToDescriptionContainer}>
      <button onClick={handleBackTop}>Ver todas características</button>
    </div>
  )
}

export default ScrollToDescription
