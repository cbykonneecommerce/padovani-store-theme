import { useFormikContext } from "formik";
import React, { useEffect, useState} from "react";

import styles from '../../../../../styles/css/template.steps-form.css'

export const FieldSelectInput  = (
    { name, label, options, required, width}) => {
    const { values, touched, handleChange, handleBlur, errors } = useFormikContext();
    const [, setOptions] = useState([]);

    useEffect(() => {
        setOptions(options);
    }, [options]);

    return (
        <div
        className={`${styles.fieldGroup} ${[name]} ${errors[name] && touched[name] && styles.fieldGroupError}`}
        style={{width: width ? `${width}%` : `100%`}}
        >
            <label
            htmlFor={name}
            className={required ? styles.fieldLabelRequired : styles.fieldLabel}
            >
                {label}
            </label>
            <select
                name={name}
                onChange={(e) => {
                    handleChange(e);
                }}
                onBlur={handleBlur}
                value={values[name]}
                className={styles.fieldInput}
            >
                <option></option>
                {options?.map((option)=>(<option key={option.value} >{option.value}</option>))}
            </select>
            <span className={styles.error}> {errors[name] && touched[name] && errors[name]}</span>
        </div>
    );
};
