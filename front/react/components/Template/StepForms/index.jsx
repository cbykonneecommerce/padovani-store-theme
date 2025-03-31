import React, { useState, useEffect } from "react";

import { StepHeader } from "./components/StepsHeader";
import { Step } from "./components/Step";

import { sendAttachment , saveData} from "./services";

import styles from "../../../styles/css/template.steps-form.css"
import SuccessMessage from "./components/messages/SuccessMessage";
import ErrorMessage from "./components/messages/ErrorMessage";

const StepForms = ({ propsForm }) => {
    const [data, setData] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const steps = propsForm?.steps?.map((step, index) => (
        <Step
          key={index}
          inputs={step.inputs}
          data={data}
          index={index}
          totalSteps={propsForm?.steps?.length}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
    )); 

    function generateInitialStates() {
        const initialValues = {};
        propsForm?.steps?.forEach((step) => {
            step?.inputs?.forEach((input) => {
                initialValues[input.name] = '';
            });
        });
    
        setData(initialValues);
    }

    async function makeRequest(formData) {
        saveData(formData, propsForm?.entity)
            .then(document => {
                const { file, fieldName } = getFileAndFieldName(formData);
    
                if (file) {
                    sendAttachment(file, document.DocumentId, fieldName, propsForm?.entity)
                        .then(result => console.log(result))
                        .catch(error => console.error(error));
                }

                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 2000);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2200);
            })
            .catch(error => {
                console.log("error ao cadastrar", error);
                setIsError(true);
                setTimeout(() => {
                    location.reload();
                }, 3000);
            });
    }
    
    function getFileAndFieldName(obj, currentFieldName = "") {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const valor = obj[key];
                const fieldName = currentFieldName ? `${currentFieldName}.${key}` : key;
    
                if (valor instanceof File) {
                    return { file: valor, fieldName };
                } else if (valor instanceof Object) {
                    const resultadoAninhado = getFileAndFieldName(valor, fieldName);
                    if (resultadoAninhado.file) {
                        return resultadoAninhado;
                    }
                }
            }
        }
        return { file: null, fieldName: null };
    }

    function handleNextStep(newData, final = false) {
        setData(prevData => ({ ...prevData, ...newData }));

        if (final) {
            makeRequest(newData);
            return;
        }

        setCurrentStep(prev => prev + 1);
    }

    function handlePrevStep(newData) {
        setData(prevData => ({ ...prevData, ...newData }));
        setCurrentStep(prev => prev - 1);
    }
    
    useEffect(() => {
        generateInitialStates();
    }, [])

    if (data === null || steps?.length < 1 || steps === undefined) return <></>

    return (
        <div className={styles.StepsFormContainer}>
            <StepHeader currentStep={currentStep} steps={propsForm?.steps} />
            {steps[currentStep]}
            < SuccessMessage isActive={isSuccess} />
            < ErrorMessage isActive={isError} />
        </div>
    )
}

export default StepForms;

StepForms.schema = {
    title: 'Formulário',
    type: 'object',
    properties: {
        entity: {
          title: 'Sigla da entidade de dados no MasterData',
          type: 'string',
        },
        steps: {
          title: 'Passos do formuário',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                title: 'Título da etapa',
                type: 'string',
              },
              inputs: {
                title: 'Inputs',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    inputType: {
                      title: 'Input Type',
                      type: 'string',
                      enum: [
                        'default',
                        'email',
                        'cpf',
                        'cnpj',
                        'phone',
                        'cep',
                        'select',
                        'radio',
                        'checkbox',
                        'file',
                        'text-area',
                      ],
                      enumNames: [
                        'Input Padrão',
                        'Email',
                        'CPF',
                        'CNPJ',
                        'Telefone',
                        'CEP',
                        'Seletor de várias opções',
                        'Radio',
                        'Checkbox',
                        'Arquivo',
                        'Área de texto (mensagens longas)',
                      ],
                    },
                  },
                  required: ['inputType'],
                  dependencies: {
                      inputType: {
                          oneOf: [
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['default']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      placeholder: {
                                      title: 'Placeholder',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      }
                                  }
                              },
                              {
                                properties: {
                                    inputType: {
                                        enum: ['email']
                                    },
                                    name: {
                                        title: 'Nome do input no Master Data',
                                        type: 'string',
                                    },
                                    label: {
                                    title: 'Label/Nome que aparecerá na tela',
                                    type: 'string',
                                    },
                                    placeholder: {
                                    title: 'Placeholder',
                                    type: 'string',
                                    },
                                    required: {
                                    title: 'É obrigatório?',
                                    type: 'boolean',
                                    default: false,
                                    },
                                    width: {
                                    title: 'largura',
                                    type: 'integer',
                                    }
                                }
                            },
                            {
                                properties: {
                                    inputType: {
                                        enum: ['cpf']
                                    },
                                    name: {
                                        title: 'Nome do input no Master Data',
                                        type: 'string',
                                    },
                                    label: {
                                    title: 'Label/Nome que aparecerá na tela',
                                    type: 'string',
                                    },
                                    placeholder: {
                                    title: 'Placeholder',
                                    type: 'string',
                                    },
                                    required: {
                                    title: 'É obrigatório?',
                                    type: 'boolean',
                                    default: false,
                                    },
                                    width: {
                                    title: 'largura',
                                    type: 'integer',
                                    }
                                }
                              },
                              {
                                properties: {
                                    inputType: {
                                        enum: ['cnpj']
                                    },
                                    name: {
                                        title: 'Nome do input no Master Data',
                                        type: 'string',
                                    },
                                    label: {
                                    title: 'Label/Nome que aparecerá na tela',
                                    type: 'string',
                                    },
                                    placeholder: {
                                    title: 'Placeholder',
                                    type: 'string',
                                    },
                                    required: {
                                    title: 'É obrigatório?',
                                    type: 'boolean',
                                    default: false,
                                    },
                                    width: {
                                    title: 'largura',
                                    type: 'integer',
                                    }
                                }
                            },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['phone']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      }
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['cep']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      }
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['select']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      },
                                      options: {
                                          title: 'Opções',
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            properties: {
                                              value: {
                                                title: 'Opção',
                                                type: 'string',
                                              },
                                            },
                                          },
                                      },
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['radio']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      },
                                      options: {
                                          title: 'Opções',
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            properties: {
                                              value: {
                                                title: 'Opção',
                                                type: 'string',
                                              },
                                            },
                                          },
                                      },
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['checkbox']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      },
                                      options: {
                                          title: 'Opções',
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            properties: {
                                              value: {
                                                title: 'Opção',
                                                type: 'string',
                                              },
                                            },
                                          },
                                      },
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['file']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      }
                                  }
                              },
                              {
                                  properties: {
                                      inputType: {
                                          enum: ['text-area']
                                      },
                                      name: {
                                          title: 'Nome do input no Master Data',
                                          type: 'string',
                                      },
                                      label: {
                                      title: 'Label/Nome que aparecerá na tela',
                                      type: 'string',
                                      },
                                      placeholder: {
                                      title: 'Placeholder',
                                      type: 'string',
                                      },
                                      required: {
                                      title: 'É obrigatório?',
                                      type: 'boolean',
                                      default: false,
                                      },
                                      width: {
                                      title: 'largura',
                                      type: 'integer',
                                      }
                                  }
                              },
                          ]
                      }
                  }
                },
              },
            },
          },
        },
    }
};
  