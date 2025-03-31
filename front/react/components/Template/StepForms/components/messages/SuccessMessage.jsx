import React from 'react'

import styles from '../../../../../styles/css/template.steps-form.css';

export default function SuccessMessage({isActive}) {
    return (
    <>  
        <div className={`${styles.overlay}  ${isActive && styles.isActive}`}></div>
        <div className={`${styles.SuccessContainer}  ${isActive && styles.isActive}`}>
            <h2 className={styles.title}>
                Informações enviadas com sucesso!
            </h2>
            <p className={styles.subtitle}>
                Obrigado!
            </p>
        </div>
    </>
  )
}
