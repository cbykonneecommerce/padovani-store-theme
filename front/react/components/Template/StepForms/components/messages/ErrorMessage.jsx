import React from 'react'

import styles from '../../../../../styles/css/template.steps-form.css';

export default function ErrorMessage({isActive}) {
  return (
    <>
      <div className={`${styles.overlay}  ${isActive && styles.isActive}`}></div>
      <div className={`${styles.ErrorContainer}  ${isActive && styles.isActive}`}>
        <h2 className={styles.title}>Ocorreu um erro!</h2>
        <p className={styles.subtitle}>
          Tente novamente mais tarde ou entre em contato com a nossa equipe
        </p>
      </div>
    </>

  )
}
