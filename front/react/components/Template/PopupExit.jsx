import { useState, useEffect } from 'react'
import CloseIcon from '../../UI/CloseIcon/CloseIcon'
import { Link } from 'vtex.render-runtime'

import styles from '../../styles/css/template.popupExit.css'

const EXIT_MODAL_LOCALSTORAGE_KEY = 'exit-modal'

const PopupExit = (props) => {
  const [isModalVisible, setModalVisible] = useState(false)

  const showModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    localStorage.setItem(EXIT_MODAL_LOCALSTORAGE_KEY, 'true')
  }

  useEffect(() => {
    const handleMouseLeave = (event) => {
      const localStorageKey = localStorage.getItem(EXIT_MODAL_LOCALSTORAGE_KEY)

      if (localStorageKey === 'true') {
        return
      }

      if (event.clientY < 0) {
        showModal()
      }
    }

    document.addEventListener('mouseout', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [])

  if (!props.popupActive) return null

  return (
    <>
      {isModalVisible && (
        <div className={styles.PopupContainer}>
          <div className={styles.PopupOverlay} onClick={closeModal}></div>
          <div className={styles.PopupWrapperContentImage}>
            {props.imageDescriptionPopup && props.imagePopup && (
              <Link target="_blank" to={props.imageURL}>
                <img
                  src={props.imagePopup}
                  alt={props.imageDescriptionPopup}
                />
              </Link>
            )}
            <CloseIcon closeModal={closeModal} />
          </div>
        </div>
      )}
    </>
  )
}

PopupExit.schema = {
  title: 'Popup de Saida',
  type: 'object',
  properties: {
    popupActive: {
      title: 'Popup Ativo',
      type: 'boolean',
      widget: {
        'ui:widget': 'checkbox',
      },
      default: true,
    },
    imagePopup: {
      title: 'Imagem Popup',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    imageDescriptionPopup: {
      title: 'Descrição da imagem Popup',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    imageURL: {
      title: 'URL da Imagem',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}

export default PopupExit
