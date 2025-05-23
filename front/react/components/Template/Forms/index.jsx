import { useEffect, useState } from 'react'

import styles from '../../../styles/css/template.forms.css'
import Field from './Field'

import { index as RichText } from 'vtex.rich-text'

const Forms = ({ closeModal, ...props }) => {
  const [send, setSend] = useState(false)
  const [data, setData] = useState(null)
  const [file, setFile] = useState({})
  const [typeFiles, setTypeFiles] = useState([])
  const [required, setRequired] = useState([])
  const [message, setMessage] = useState(null)
  const [modal, setModal] = useState(null)

  if (!props.isActive) return null

  useEffect(() => {
    if (message?.type == 'success') {
      if (closeModal) {
        setTimeout(() => {
          closeModal()
        }, 4000)
      }
    }
  }, [message])

  return (
    <div className={`${styles.forms} ${styles[props.blockClass]}`}>
      <h2>{props.title}</h2>
      <RichText text={props.description} />
      <div className={styles.content}>
        {modal != null && (
          <div className={styles.modal}>
            <div
              className={styles.closeModal}
              onClick={() => {
                setModal(null)
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.3333 53.3334L10.6666 10.6667M53.3333 10.6667L10.6666 53.3334"
                  stroke="white"
                  stroke-width="5.33333"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div className={styles.modalContent}>
              {props.whatsappOptions.map((elem) => {
                return (
                  <a
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=${elem.phone}&text=${modal}`}
                  >
                    {elem.name}
                  </a>
                )
              })}
            </div>
          </div>
        )}
        <div className={styles.form}>
          {message && (
            <div
              id="message"
              className={`${styles.message} ${styles[message.type]}`}
            >
              <RichText text={message.text} />
            </div>
          )}
          {
            <form action="" enctype="multipart/form-data">
              {props.fields.map((elem) => {
                return (
                  <>
                    <Field
                      props={props}
                      type={elem.type}
                      elem={elem}
                      data={data}
                      setData={setData}
                      file={file}
                      setFile={setFile}
                      typeFiles={typeFiles}
                      setTypeFiles={setTypeFiles}
                      required={required}
                      setRequired={setRequired}
                      message={message}
                      setMessage={setMessage}
                      modal={modal}
                      setModal={setModal}
                      send={send}
                      setSend={setSend}
                    />
                  </>
                )
              })}
            </form>
          }
        </div>
      </div>
    </div>
  )
}

Forms.schema = {
  title: 'Formulário',
  type: 'object',
  properties: {
    isActive: {
      title: 'Formulário Ativo',
      type: 'boolean',
      widget: {
        'ui:widget': 'checkbox',
      },
      default: false,
    },
    title: {
      title: 'Título',
      type: 'string',
    },
    description: {
      title: 'Texto',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    showLabel: {
      title: 'Mostrar Label',
      type: 'boolean',
      widget: {
        'ui:widget': 'checkbox',
      },
      default: false,
    },
    entity: {
      title: 'Entidade de Dados',
      type: 'string',
    },
    gap: {
      title: 'Espaçamento entre os campos',
      type: 'string',
    },
    fields: {
      title: 'Campos',
      type: 'array',
      items: {
        properties: {
          __editorItemTitle: {
            title: 'Título',
            type: 'string',
          },
          name: {
            title: 'Nome do campo no MasterData',
            type: 'string',
          },
          placeholder: {
            title: 'Placeholder',
            type: 'string',
          },
          type: {
            title: 'Tipo',
            type: 'string',
            enum: [
              'title',
              'submit',
              'whatsapp',
              'cep',
              'date',
              'phone',
              'cpf',
              'cnpj',
              'cpfcnpj',
              'email',
              'text',
              'textarea',
              'checkbox',
              'radio',
              'checkbox-description',
              'select',
              'address',
              'file',
            ],
            widget: {
              'ui:widget': 'select',
            },
          },
          size: {
            title: 'Largura',
            type: 'string',
            description: 'Largura do campo em porcentagem ex: 50%',
          },
          required: {
            title: 'É obrigatório?',
            type: 'boolean',
            widget: {
              'ui:widget': 'checkbox',
            },
          },
          checked: {
            title: 'Em caso de checkbox inicia com check?',
            type: 'boolean',
            widget: {
              'ui:widget': 'checkbox',
            },
          },
          description: {
            title: 'Descrição',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          options: {
            title: 'Opções',
            type: 'array',
            description: 'Para o tipo Rádio ou Select',
            items: {
              properties: {
                __editorItemTitle: {
                  title: 'Nome do campo',
                  type: 'string',
                  description: 'Apenas no site editor',
                },
                label: {
                  title: 'Label',
                  type: 'string',
                  description: 'Nome Vísivel',
                },
                value: {
                  title: 'Valor',
                  type: 'string',
                  description: 'Valor salvo no Master Data',
                },
              },
            },
          },
        },
      },
    },
    message: {
      title: 'Mensagem',
      type: 'object',
      properties: {
        success: {
          title: 'Mensagem de Sucesso',
          type: 'string',
          widget: {
            'ui:widget': 'textarea',
          },
        },
        error: {
          title: 'Mensagem de Erro',
          type: 'string',
          description: 'Após a mensagem será informado o tipo de erro.',
          widget: {
            'ui:widget': 'textarea',
          },
        },
      },
    },
  },
}

export default Forms
