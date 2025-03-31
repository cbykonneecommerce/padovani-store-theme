import { useLayoutEffect } from "react"
import { useRuntime } from 'vtex.render-runtime'
import { index as RichText } from 'vtex.rich-text'

import styles from "../../styles/css/template.dynamic-pages.css"

const DynamicPages = ({...props}) => {

    const { hints } = useRuntime()

    if(props.hiddenSection) return null

    return(
        <div className={`${styles.DynamicPages}`}>
            {
                props?.sections && props?.sections.map((item, index) => {
                    return(
                        <div className={`${styles[props.blockClass]} ${styles[item.layout]}`}>
                            { props.separatorSVG && index > 0 && <i className={styles.icon} dangerouslySetInnerHTML={{__html: props.separatorSVG}}></i>}
                            {
                                item.imageDetail && item.imageDetail.length > 0 &&
                                item.imageDetail.map(image => {
                                    return(
                                        <a href={item.url} target={item.target ? "_blank" : "_self"} className={styles.image}>
                                            <img className={styles.tagImg} src={ image.image } alt={item.__editorItemTitle} style={{ width: image.width ? image.width : "100%", height: image.height ? image.height : "auto" }} />
                                        </a>
                                    )
                                })
                            }
                            {
                                item.layout != "imagem" &&
                                    <div className={styles.showText}>
                                        { item.svgIcon && item.layout != "texto" && <i className={styles.icon} dangerouslySetInnerHTML={{__html: item.svgIcon}}></i>}
                                        { item.__editorItemTitle && item.layout != "texto" && <h2 className={styles.heading}>{item.__editorItemTitle}</h2>}
                                        { item.subtitle && item.layout != "texto" && <h3 className={styles.subHeading}>{item.subtitle}</h3>}
                                        { item.text && <div className={styles.text}><RichText text={item.text} /></div>}
                                        { item.cta && item.layout != "texto" &&  <a className={styles.cta}>{item.cta}</a>}
                                    </div>
                            }
                            {
                                item.list && item.list.length > 0 &&
                                    <div className={styles.list}>
                                        {
                                            item.list.map(list => {
                                            console.log("🚀 ~ file: DynamicPages.jsx:61 ~ props?.sections&&props?.sections.map ~ list:", list)

                                                return(
                                                    <div className={styles.listItem} style={{ width: window.innerWidth ? item.listWidthDesktop ? item.listWidthDesktop : "100%" : item.listWidthMobile ? item.listWidthMobile : "100%" }}>
                                                        { list?.listImage[0]?.image && <img className={styles.tagImg} src={ list?.listImage[0]?.image } alt={list.__editorItemTitle}  /> }
                                                        <div className={styles.textList}>
                                                            { list.svgIcon && <i className={styles.icon} dangerouslySetInnerHTML={{__html: list.svgIcon}}></i>}
                                                            { list.__editorItemTitle && <strong className={styles.heading}>{list.__editorItemTitle}</strong>}
                                                            { list.subtitle && <small className={styles.subHeading}>{list.subtitle}</small>}
                                                            { list.text && <div className={styles.text}><RichText text={list.text} /></div>}
                                                            { list.cta && <a className={styles.cta}>{list.cta}</a>}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

DynamicPages.schema = {
    title: "Conteúdo",
    type: "object",
    properties: {
        hiddenSection: {
            title: "Ocultar sessão?",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: true
        },
        sections: {
            type: "array",
            title: "Sessões",
            items: {
            properties: {
                layout: {
                    title: "Tipo",
                    type: "string",
                    enum: [
                        "titulo-e-texto",
                        "linha",
                        "linha-invertida",
                        "texto",
                        "imagem",
                        "lista"
                    ],
                    widget: {
                        'ui:widget': 'select',
                    },
                },
                __editorItemTitle: {
                    title: "Título",
                    type: "string"
                },
                imageDetail: {
                    title: "Imagem",
                    type: "array",
                    items: {
                        properties: {
                            image: {
                                title: "Imagem",
                                type: "string",
                                widget: {
                                    'ui:widget': 'image-uploader',
                                },
                            },
                            width: {
                                title: "Texto",
                                type: "string",
                                description: "px ou %",
                                default: "100%"
                            },
                            height: {
                                title: "Texto",
                                type: "string",
                                description: "px ou %",
                                default: "auto"
                            }
                        }
                    }
                },
                subtitle: {
                    title: "Subtítulo",
                    type: "string"
                },
                text: {
                    title: "Texto",
                    type: "string",
                    widget: {
                        'ui:widget': 'textarea',
                    },
                },
                cta: {
                    title: "Texto Botão",
                    type: "string"
                },
                url: {
                    title: "Link o Item",
                    type: "string"
                },
                target: {
                    title: "Nova Janela?",
                    type: "boolean",
                    widget: {
                        'ui:widget': 'checkbox',
                    },
                    default: false
                },
                list: {
                    type: "array",
                    title: "Lista / Icones",
                    items: {
                        properties: {
                            __editorItemTitle: {
                                title: "Título",
                                type: "string"
                            },
                            subtitle: {
                                title: "Subtítulo",
                                type: "string"
                            },
                            text: {
                                title: "Subtítulo",
                                type: "string",
                                widget: {
                                    'ui:widget': 'textarea',
                                },
                            },
                            cta: {
                                title: "Texto Botão",
                                type: "string"
                            },
                            url: {
                                title: "Link o Item",
                                type: "string"
                            },
                            target: {
                                title: "Nova Janela?",
                                type: "boolean",
                                widget: {
                                    'ui:widget': 'checkbox',
                                },
                                default: false
                            },
                            listImage: {
                                title: "Imagem",
                                type: "array",
                                items: {
                                    properties: {
                                        image: {
                                            title: "Imagem",
                                            type: "string",
                                            widget: {
                                                'ui:widget': 'image-uploader',
                                            },
                                        },
                                        alt: {
                                            title: "Texto alternativo",
                                            type: "string"
                                        },
                                    }
                                }
                            },
                            svgIcon: {
                                title: "Icone SVG",
                                type: "string"
                            }
                        }
                    }
                },
                listWidthDesktop: {
                    title: "Desktop - Largura dos itens",
                    type: "string"
                },
                listWidthMobile: {
                    title: "Mobile - Largura dos itens",
                    type: "string"
                }
            }
        },
        widthList: {
            title: "Largura dos Itens da lista",
            type: "object",
            properties: {
                desktop: {
                    title: "Largura Desktop",
                    type: "string",
                    description: "Largura em % porcentagem dos itens da lista"
                },
                subtitle: {
                    title: "Largura Mobile",
                    type: "string",
                    description: "Largura em % porcentagem dos itens da lista"
                },
            }
        },
        separatorSVG: {
            title: "Separador SVG",
            type: "string"
        }
        }
    }
}

export default DynamicPages
