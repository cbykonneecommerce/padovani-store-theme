import React from "react"
import { useRuntime } from 'vtex.render-runtime'
import { index as RichText } from 'vtex.rich-text'
import { SliderLayout } from 'vtex.slider-layout'

import styles from "../../styles/css/template.dynamic-content.css"

const DynamicContent = ({ ...props }) => {
    const { hints } = useRuntime()
    const sliderLayoutConfig = hints.mobile && props.sliderLayoutConfigMobile ? props.sliderLayoutConfigMobile : props.sliderLayoutConfig

    return(
        <div className={styles[props.blockClass]}>
            { props.title && <div className={styles.title}><RichText text={props.title} /></div>}
            { props.subtitle && <div className={styles.subTitle}><RichText text={props.subtitle} /></div>}
            <SliderLayout {...sliderLayoutConfig} totalItems={props.data.length}>
            {   
                props.data.map((item, index) => {
                    return(
                        <div className={`${styles[props.blockClass]}-wrapper`} key={index}>
                            { props.separatorSVG && hints.desktop && index > 0 && <i className={styles.icon} dangerouslySetInnerHTML={{__html: props.separatorSVG}}></i>}
                            <a href={item.url} className={`${styles.items} ${item.url ? styles.link : ""}`}>
                                {   
                                    item.listImages && item.listImages.length > 0 &&
                                        item.listImages.map(image => {
                                            return(
                                                <div className={styles.image}>
                                                    <img src={ hints.mobile && image.imageMobile ? image.imageMobile : image.imageDesktop } alt={item.__editorItemTitle} title={item.__editorItemTitle} />
                                                </div>
                                            )
                                        })
                                }
                                { 
                                    !props.hiddenTitleItems &&
                                        <> 
                                            { item.svgIcon && item.text && <img className={styles.icon} src={item.svgIcon} alt={item.text} />}
                                            { item.__editorItemTitle && <div className={styles.heading}><RichText text={item.__editorItemTitle} /></div>}
                                            { item.subtitle && <div className={styles.subHeading}><RichText text={item.subtitle} /></div>}
                                            { item.text && <div className={styles.text}><RichText text={item.text} /></div>}
                                        </>
                                }
                            </a>
                        </div>
                    )
                })
            }
            </SliderLayout>
        </div>
    )
}

DynamicContent.schema = {
    title: "Conteúdo",
    type: "object",
    properties: {
        title: {
            title: "Título",
            type: "string"
        },
        subtitle: {
            title: "Subtítulo",
            type: "string"
        },
        hiddenTitleItems: {
            title: "Ocultar títulos dos items?",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: true
        },
        data: {
            type: "array",
            title: "Items",
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
                svgIcon: {
                    title: "Icone SVG",
                    type: "string",
                    widget: {
                        'ui:widget': 'image-uploader',
                    },
                },
                listImages: {
                    title: "Imagens",
                    type: "array",
                    items: {
                        type: "object",
                        title: "Images",
                        properties: {
                            imageDesktop: {
                                title: "Imagem Desktop",
                                type: "string",
                                widget: {
                                    'ui:widget': 'image-uploader',
                                },
                            },
                            imageMobile: {
                                title: "Imagem Mobile",
                                type: "string",
                                widget: {
                                    'ui:widget': 'image-uploader',
                                },
                            },
                        }
                        }
                    }
                }
                
            }
        },
        separatorSVG: {
            title: "Separador SVG",
            type: "string"
        },
        sliderLayoutConfig: {
            title: "Objeto",
            type: "string"
        }
    }
}

export default DynamicContent