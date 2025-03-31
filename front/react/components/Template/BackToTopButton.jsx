import React, { useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'vtex.store-icons'
import classNames from 'classnames'

import styles from '../../styles/css/template.scrollToTop.css'

const handleBackTop = () => {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' })
}

const BackToTopButton = ({
  displayThreshold = 600
}) => {
  const [isShowed, setIsShowed] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const backToTopButtonClasses = classNames(
    `${styles.backToTopButtonContainer} z-999 fixed`,
    {
      [`${styles.backToTopButtonHidden}`]: !isShowed,
      [`${styles.backToTopButtonActive}`]: isShowed,
    }
  )

  function scrollValue() {
    setScrollY(window.pageYOffset)
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollValue)
    return () => {
      window.removeEventListener('scroll', scrollValue)
    }
  }, [])

  useEffect(() => {
    if (scrollY > displayThreshold) {
      setIsShowed(true)
    } else {
      setIsShowed(false)
    }
  }, [scrollY, displayThreshold])

  return  (
    <div className={backToTopButtonClasses}>
      <Button onClick={handleBackTop} size="regular">
        <Icon id="nav-caret--up" size="16" />
      </Button>
    </div>
  )
}

export default BackToTopButton