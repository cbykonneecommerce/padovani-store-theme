import { useFormikContext } from 'formik';
import React from 'react';

import styles from '../../../../../styles/css/template.steps-form.css';

export const TextAreaInput = ({
    name,
    label,
    required,
    placeholder,
    width
}) => {
    const { values, touched, handleChange, handleBlur, errors } =
        useFormikContext();

    return (
        <div
            className={`${styles.fieldGroup} ${[name]} ${
                errors[name] && touched[name] && styles.fieldGroupError
            }`}
            style={{ width: width ? `${width}%` : `100%` }}
        >
            <label
                htmlFor={name}
                className={required ? styles.fieldLabelRequired : styles.fieldLabel}
            >
                {label}
            </label>
            <textarea
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[name]}
                className={styles.fieldInput}
                placeholder={placeholder}
            />
            <span className={styles.error}>
                {' '}
                {errors[name] && touched[name] && errors[name]}
            </span>
        </div>
    );
};
