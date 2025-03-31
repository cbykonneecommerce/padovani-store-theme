import { useLayoutEffect } from "react"
import { useRuntime } from 'vtex.render-runtime'
import { index as RichText } from 'vtex.rich-text'
import { SliderLayout } from 'vtex.slider-layout'

import styles from "../../styles/css/template.dynamic-banners.css"

const DynamicBanner = ({...props}) => {
  
    const { hints } = useRuntime()
    const calcSize = 100 / props.data.length

    const sliderLayoutConfig = hints.mobile && props.sliderLayoutConfigMobile ? props.sliderLayoutConfigMobile : props.sliderLayoutConfig

    return(
        hints.mobile && props.sliderOnMobile ?
            <div className={styles[props.blockClass]}>
                { props.title && <div className={styles.title}><RichText text={props.title} /></div>}
                <div className={styles.items}>
                    <SliderLayout {...sliderLayoutConfig} totalItems={props.data.length}>
                        {
                            props.data.map((item, index) => {
                                return(
                                    <a href={item.url} className={`${styles.item} ${styles[item.position]} ${item.url ? styles.link : ""}`} style={{ width: `calc(${calcSize}% - ${props.gap}px)` }}>
                                        <img src={ hints.mobile && item.imageMobile ? item.imageMobile : item.imageDesktop } alt={item.__editorItemTitle} title={item.__editorItemTitle} />
                                        {
                                            item.hiddenTitle != true &&
                                                <div className={styles.text}>
                                                    { item.__editorItemTitle && <div className={styles.title}><RichText text={item.__editorItemTitle} /></div>}
                                                    { item.subtitulo && <div className={styles.subtitle}><RichText text={item.subtitulo} /></div>}
                                                </div>
                                        }
                                    </a>
                                )
                            })
                        }
                    </SliderLayout>
                </div>
            </div>
        :
            <div className={styles[props.blockClass]}>
                { props.title && <div className={styles.title}><RichText text={props.title} /></div>}
                <div className={styles.items}>
                {
                    props.data.map((item, index) => {
                        return(
                            <a href={item.url} className={`${styles.item} ${styles[item.position]} ${item.url ? styles.link : ""}`} style={{ width: `calc(${calcSize}% - ${props.gap}px)` }}>
                                <img src={ hints.mobile && item.imageMobile ? item.imageMobile : item.imageDesktop } alt={item.__editorItemTitle} title={item.__editorItemTitle} />
                                {
                                    item.hiddenTitle != true &&
                                        <div className={styles.text}>
                                            { item.__editorItemTitle && <div className={styles.title}><RichText text={item.__editorItemTitle} /></div>}
                                            { item.subtitulo && <div className={styles.subtitle}><RichText text={item.subtitulo} /></div>}
                                        </div>
                                }
                            </a>
                        )
                    })
                }
                </div>
            </div>
    )
}

DynamicBanner.schema = {
    title: "Conteúdo",
    type: "object",
    properties: {
        title: {
            title: "Título",
            type: "string"
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
                    subtitulo: {
                        title: "Subtítulo",
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
                    imageDesktop: {
                        title: "Imagem Desktop",
                        type: "string",
                        widget: {
                            'ui:widget': 'image-uploader',
                        }
                    },
                    imageMobile: {
                        title: "Imagem Mobile",
                        type: "string",
                        widget: {
                            'ui:widget': 'image-uploader',
                        }
                    },
                    hiddenTitle: {
                        title: "Ocultar Título?",
                        type: "boolean",
                        widget: {
                            'ui:widget': 'checkbox',
                        },
                        default: false
                    },
                }
            }
        }
    }
}

export default DynamicBanner