import React from 'react';
import styles from '../../../../styles/css/template.steps-form.css';

export const StepHeader = ({ currentStep, steps }) => {
    return (
      <ul className={styles.StepHeader}>
        {steps?.map((step, index) => (
          <li
            key={index}
            className={index === currentStep ? styles.ActiveStep : styles.InactiveStep}
          >
            {step.title}
          </li>
        ))}
      </ul>
    );
};