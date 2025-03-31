import React from 'react';
import { useFormikContext } from 'formik';

import styles from '../../../../../styles/css/template.steps-form.css';

export const FileInput = ({ name, label, required, width }) => {
  const { setFieldValue, touched, errors } = useFormikContext();
  
  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue(name, file);
  };

  return (
    <div
      className={`${styles.fieldGroup} ${[name]} ${
        errors[name] && touched[name] && styles.fieldGroupError
      } ${styles.fileOption}`}
      style={{width: width ? `${width}%` : `100%`}}
    >
      <label
        htmlFor={name}
        className={required ? styles.fieldLabelRequired : styles.fieldLabel}
      >
        {label}
      </label>
      <input
        type="file"
        placeholder='Escolha um valor'
        name={name}
        onChange={handleChange}
        className={styles.fieldInput}
      />
      <span className={styles.error}>
        {errors[name] && touched[name] && errors[name]}
      </span>
    </div>
  );
};
