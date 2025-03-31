import { index as RichText } from 'vtex.rich-text'

import styles from "../../styles/css/template.seo-text.css"

const SeoText = (props) => {

    if(props.showSection != true) return null

    return(
        <div className={`${styles.wrapperSeo} ${styles[props.blockClass]}`}>
            {
                props.url && props.url != "" ?
                    <a className={styles.linkSeo} href={props.url} target={props.target ? "_blank" : "_self"}>
                        { props.image && props.image != "" && <img className={styles.imageSeo} src={props.image} alt={props.title} /> }
                    </a>
                :
                    props.image && props.image != "" && <img className={styles.imageSeo} src={props.image} alt={props.title} /> 
            }
            <div className={styles.textSeo}><RichText text={props.text} /></div>
        </div>
    )
}

SeoText.schema = {
    title: "SEO Texto",
    type: "object",
    properties: {
        showSection: {
            title: "Mostrar bloco?",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: false
        },
        title: {
            title: "Título",
            type: "string",
            description: "Apenas utilizado para texto alternativo da imagem"
        },
        text: {
            title: "Texto",
            type: "string",
            widget: {
                'ui:widget': 'textarea',
            },
        },
        image: {
            title: "Imagem",
            type: "string",
            widget: {
                'ui:widget': 'image-uploader',
            }
        },
        url: {
            title: "Link do banner",
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
    }
}

export default SeoText