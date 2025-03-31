import { useLayoutEffect } from "react"

import { index as RichText } from 'vtex.rich-text'
import { SliderLayout } from 'vtex.slider-layout'

import styles from "../../styles/css/template.icons.css"

const Icons = ({...props}) => {

    const sliderLayoutConfig = props.sliderLayoutConfig

    return(
        <div className={styles[props.blockClass]}>
            { props.title && <div className={styles.title}><RichText text={props.title} /></div>}
            <div className={styles.items}>
            {
                props.data.map((item, index) => {
                    return(
                        <a key={index} href={item.url} target={item.target ? "_blank" : "_self"} className={`${styles.item} ${item.url ? styles.link : ""}`}>
                            { item.icon && <img className={styles.icon} src={item.icon} title={item.__editorItemTitle} alt={item.__editorItemTitle} />}
                        </a>
                    )
                })
            }
            </div>
        </div>
    )
}

Icons.schema = {
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
                    icon: {
                        title: "Icone",
                        type: "string",
                        widget: {
                            'ui:widget': 'image-uploader',
                        }
                    }
                }
            }
        }
    }
}

export default Icons