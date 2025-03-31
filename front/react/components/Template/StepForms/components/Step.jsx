import React from "react";

import { Formik, Form } from "formik";
import { generateValidationSchema } from "../validation/generateValidationSchema";
 
import { useInputToRender } from "../hooks/useInputToRender";

import styles from '../../../../styles/css/template.steps-form.css';

const Step = ({ inputs, data, index, totalSteps, onNext, onPrev }) => {
    const validationSchema = generateValidationSchema(inputs);
  
    function handleSubmit(values) {
      if (index === totalSteps - 1) {
        onNext(values, true);
      } else {
        onNext(values);
      }
    }
  
    return (
      <Formik
        initialValues={data}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            {inputs?.map((input, i) => (
              <React.Fragment key={i}>
                {useInputToRender(input)}
              </React.Fragment>
            ))}
            <div className={styles.StepsFormFooter}>
              {index > 0 && (
                <button type="button" onClick={() => onPrev(data)}>
                  Voltar
                </button>
              )}
              <button type="submit">
                {index === totalSteps - 1 ? "Enviar" : "Próximo"}
              </button>
            </div>

          </Form>
        )}
      </Formik>
    );
};

export {Step}