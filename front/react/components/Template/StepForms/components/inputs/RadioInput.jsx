import { useFormikContext } from "formik";
import React from "react";

import styles from '../../../../../styles/css/template.steps-form.css'

export const RadioInput = ({ name, label, options, required, width }) => {
  const { values, touched, handleChange, handleBlur, errors } = useFormikContext();

  return (
    <div
      className={`${styles.fieldGroup} ${styles.radioOption} ${[name]} ${errors[name] && touched[name] && styles.fieldGroupError}`}
      style={{width: width ? `${width}%` : `100%`}}
    >
      <label htmlFor={name} className={required ? styles.fieldLabelRequired : styles.fieldLabel}>
        {label}
      </label>

      {options?.map((option) => (
        <div key={option.value} className={styles.radioContainer}>
          <input
            type="radio"
            id={`${name}_${option.value}`}
            name={name}
            value={option.value}
            checked={values[name] === option.value}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <label htmlFor={`${name}_${option.value}`} className={styles.radioLabel}>
            {option.value}
          </label>
        </div>
      ))}

      <span className={styles.error}>{errors[name] && touched[name] && errors[name]}</span>
    </div>
  );
};
