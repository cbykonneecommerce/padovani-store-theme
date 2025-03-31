import styles from "../../../../styles/css/product.cities-to-served.css"
import classNames from 'classnames'

const Modal = ({ props, isOpen, toggleModal }) => {
    const ModalClasses = classNames(
        `${styles.ModalContainer} fixed`,
        {
          [`${styles.ModalContainerHidden}`]: !isOpen,
          [`${styles.ModalContainerActive}`]: isOpen,
        }
    )

    return (
        <>
            <div className={isOpen && styles.OverlayModalTable} onClick={toggleModal}></div>
            <div onClick={toggleModal} className={ModalClasses}>
                <span className={styles.CloseModal}>Fechar <strong>(X)</strong></span>
                <h2>{props.title && props?.title}</h2>
                {props.shippingCompany?.map(element => (
                    <div className={styles.CitiesContainer}>
                        <h3>{element.title}</h3>
                        <ul>
                            {element.cities.map(element => (
                                <li>{element.title}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Modal
