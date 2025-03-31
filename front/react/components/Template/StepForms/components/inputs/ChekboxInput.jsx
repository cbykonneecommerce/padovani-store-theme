import { useFormikContext } from "formik";
import React from "react";

import styles from '../../../../../styles/css/template.steps-form.css'

export const CheckboxInput = ({ name, label, options, required, width }) => {
    const { values, touched, setFieldValue, handleBlur, errors } = useFormikContext();

    const handleCheckboxChange = (optionValue) => {
        let currentValues = values[name] || [];

        if (typeof currentValues === 'string') {
            currentValues = [currentValues];
        }

        let updatedValues;

        if (currentValues?.includes(optionValue) || currentValues[0]?.includes(optionValue) ) {
            updatedValues = currentValues[0].replace(optionValue, '');
        } else {
            updatedValues = [...currentValues, optionValue];
        }

        const finalValue = Array.isArray(updatedValues) ? updatedValues.join(' ') : updatedValues;
        setFieldValue(name, finalValue);
    };

    return (
        <div
            className={`${styles.fieldGroup} ${styles.checkboxOption} ${[name]} ${errors[name] && touched[name] && styles.fieldGroupError}`}
            style={{width: width ? `${width}%` : `100%`}}
        >
            <label htmlFor={name} className={required ? styles.fieldLabelRequired : styles.fieldLabel}>
                {label}
            </label>
            
            <div className={styles.checkboxOptionContainer}>
                {options?.map((option) => (
                    <div key={option.value} className={styles.checkboxOption}>
                        <input
                            type="checkbox"
                            id={`${name}_${option.value}`}
                            name={`${name}[${option.value}]`}
                            checked={values[name]?.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                            onBlur={handleBlur}
                        />
                        <label htmlFor={`${name}_${option.value}`} className={styles.checkboxLabel}>
                            {option.value}
                        </label>
                    </div>
                ))}
            </div>

            <span className={styles.error}>{errors[name] && touched[name] && errors[name]}</span>
        </div>
    );
};
