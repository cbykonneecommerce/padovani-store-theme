import { useFormikContext } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'

import styles from '../../../../../styles/css/template.steps-form.css'

export const CnpjInput = ({
  type,
  name,
  label,
  required,
  width
}) => {
  const { values, touched, handleChange, handleBlur, errors } =
    useFormikContext()

  return (
    <div
      className={`${styles.fieldGroup} ${[name]} ${
        errors[name] && touched[name] && styles.fieldGroupError
      }`}
      style={{width: width ? `${width}%` : `100%`}}
    >
      <label
        htmlFor={name}
        className={required ? styles.fieldLabelRequired : styles.fieldLabel}
      >
        {label}
      </label>
      <InputMask
        mask="99.999.999/9999-99"
        placeholder="99.999.999/9999-99"
        type={type || 'text'}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
        className={styles.fieldInput}
      />
      <span className={styles.error}>
        {' '}
        {errors[name] && touched[name] && errors[name]}{' '}
      </span>
    </div>
  )
}
