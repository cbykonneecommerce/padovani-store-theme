import styles from "../../styles/css/icons.css";

const CloseIcon = ({closeModal, handleModalToggle}) => {
    const handleClick = () => {
        if (closeModal) {
            closeModal();
        }
        else if(handleModalToggle) (
            handleModalToggle()
        )
    };

    return (
        <div onClick={handleClick} className={styles.closeContainerIcon}>
            <div className={styles.leftright}></div>
            <div className={styles.rightleft}></div>
        </div>
    );
};

export default CloseIcon;
