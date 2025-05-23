import React from 'react'
import { index as RichText } from 'vtex.rich-text'
import styles from '../../../styles/css/landing.page-leads.css'
import StepForms from '../../Template/StepForms'

const LeadsPage = (props) => {
  return (
    <div className={styles.LeadsContainer}>
      <div className={styles.LeadsHeader}>
        {props.imgSrcHeader && props.imgAltHeader && props.linkImgHeader && (
          <a className={styles.LeadsHeaderImage} href={props.linkImgHeader}>
            <img src={props.imgSrcHeader} alt={props.imgAltHeader} />
          </a>
        )}

        {props?.items?.length > 0 && (
          <div className={styles.LeadsHeaderSocial}>
            <h2>Siga nossas redes sociais: </h2>
            <ul>
              {props?.items?.map((element, index) => (
                <li key={index}>
                  <a href={element?.linkSocial} target="_blank">
                    <img
                      src={element?.imgSrcSocial}
                      alt={element?.imgAltSocial}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <main className={styles.LeadsMainSectionContainer}>
        <section className={styles.LeadsLeftContent}>
          {props.text && <RichText text={props.text} />}

          {props.imgAlt && props.imgSrc && (
            <img src={props.imgSrc} alt={props.imgAlt} />
          )}
        </section>

        <section className={styles.LeadsRightContent}>
          {props.textRight && <RichText text={props.textRight} />}
          <StepForms propsForm={props?.form} />
        </section>
      </main>
    </div>
  )
}

export default LeadsPage

LeadsPage.schema = {
  title: 'Página de Leads',
  type: 'object',
  properties: {
    imgSrcHeader: {
      title: 'Imagem Header',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    imgAltHeader: {
      title: 'Descrição da imagem Header',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    linkImgHeader: {
      title: 'link da imagem',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    items: {
      title: 'Items de redes sociais',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          imgSrcSocial: {
            title: 'Imagem',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          imgAltSocial: {
            title: 'Descrição da imagem',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          linkSocial: {
            title: 'link',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    text: {
      title: 'Texto lado esquerdo',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    imgSrc: {
      title: 'Imagem',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    imgAlt: {
      title: 'Descrição da imagem',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    textRight: {
      title: 'Texto lado direito',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    form: {
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
                              enum: ['default'],
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
                            },
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['email'],
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
                            },
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['cpf'],
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
                            },
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['cnpj'],
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
                            },
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['phone'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['cep'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['select'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['radio'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['checkbox'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['file'],
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
                          },
                        },
                        {
                          properties: {
                            inputType: {
                              enum: ['text-area'],
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
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
