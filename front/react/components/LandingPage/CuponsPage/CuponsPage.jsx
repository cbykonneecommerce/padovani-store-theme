import React, { useState } from 'react'
import { useDevice } from 'vtex.device-detector'
import styles from '../../../styles/css/landing.page-cupons.css'

const CuponsPage = (props) => {
  const { cupons } = props
  const { isMobile } = useDevice()
  const [openCupons, setOpenCupons] = useState([])

  function toggleRules(index) {
    setOpenCupons((prevOpenCupons) => {
      if (prevOpenCupons.includes(index)) {
        return prevOpenCupons.filter((item) => item !== index)
      } else {
        return [...prevOpenCupons, index]
      }
    })
  }

  return (
    <section className={styles.CuponsPageContainer}>
      {props?.banner &&
        (isMobile ? (
          <img src={props?.banner?.imageMob} alt={props?.banner?.altImage} />
        ) : (
          <img src={props?.banner?.imageDesk} alt={props?.banner?.altImage} />
        ))}

      {props?.title && <h1>{props?.title}</h1>}

      {cupons && cupons?.length > 0 ? (
        <ul className={styles.CuponList}>
          {cupons?.map((cupon, index) => (
            <li
              className={styles.CuponItem}
              key={index}
              onClick={() => toggleRules(index)}
            >
              {cupon?.__editorItemTitle}

              <span className={styles.CuponTrigger}>
                {openCupons.includes(index) ? '-' : '+'} ver regras
              </span>

              {cupon?.rules?.length > 0 && openCupons.includes(index) && (
                <>
                  <ul className={styles.RuleList}>
                    {cupon.rules.map((rule, index) => {
                      if (rule?.__editorItemTitle?.includes('_')) {
                        return null
                      }

                      return (
                        <li className={styles.RuleItem} key={index}>
                          {rule?.__editorItemTitle}
                        </li>
                      )
                    })}
                  </ul>
                  {cupon.showButton ? (
                    <a
                      onClick={(e) => e.stopPropagation()}
                      className={styles.CuponButton}
                      target={cupon.buttonTarget ?? '_self'}
                      href={cupon.buttonLink}
                    >
                      {cupon.textButton}
                    </a>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.NotFoundCoponContainer}>
          {props?.errorMessage && <p>{props?.errorMessage}</p>}
          <span className={styles.loader}></span>
        </div>
      )}
    </section>
  )
}

CuponsPage.schema = {
  title: 'Gerenciador da Página',
  type: 'object',
  properties: {
    banner: {
      title: 'Banner',
      type: 'object',
      properties: {
        imageDesk: {
          title: 'Imagem Desktop',
          type: 'string',
          widget: {
            'ui:widget': 'image-uploader',
          },
        },
        imageMob: {
          title: 'Imagem Mobile',
          type: 'string',
          widget: {
            'ui:widget': 'image-uploader',
          },
        },
        altImage: {
          title: 'Descrição da imagem',
          type: 'string',
          widget: {
            'ui:widget': 'textarea',
          },
          default: 'Banner',
        },
      },
    },
    title: {
      title: 'Titulo',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
      default: 'Cupons Padovani | Economize na sua obra',
    },
    cupons: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Código do Cupom',
            type: 'string',
          },
          showButton: {
            title: 'Mostrar botão?',
            type: 'boolean',
            default: true,
          },
          textButton: {
            title: 'Texto do botão',
            type: 'string',
            default: 'VER PRODUTOS',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          buttonLink: {
            title: 'Link do botão',
            type: 'string',
            default: '#',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          buttonTarget: {
            title: 'Abrir link em uma nova guia?',
            type: 'boolean',
            default: false,
          },
          rules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                __editorItemTitle: {
                  title: 'Regra',
                  type: 'string',
                  widget: {
                    'ui:widget': 'textarea',
                  },
                },
              },
            },
          },
        },
      },
    },
    errorMessage: {
      title: 'Mensagem quando não tiver cupom',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
      default: 'Infelizmente não temos cupons ativos no momento',
    },
  },
}

export default CuponsPage
