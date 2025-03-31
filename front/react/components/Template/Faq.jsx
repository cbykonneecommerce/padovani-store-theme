import { useState, useLayoutEffect } from "react"
import styles from "../../styles/css/template.faq.css"
import { index as RichText } from 'vtex.rich-text'
import { Spinner } from 'vtex.styleguide'

const Faq = (props) => {

    const [ current, setCurrent ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    useLayoutEffect(() => { 
        setTimeout(() => {
            setLoading(true)
        }, 1000)
    })

    if(props?.questions == undefined || props?.questions?.length == 0) return null

    return(
        <div className={`${styles.questions} ${styles[props?.blockClass]}`}>
            <h2>{ props.title }</h2>
            {
                loading == false ?
                    <Spinner color="currentColor" size={20} /> 
                :
                    props.questions.map((item, key) => (
                        <div key={key} className={`${styles.question} ${current == item.__editorItemTitle && styles.open}`} onClick={() => { setCurrent(item.__editorItemTitle == current ? null : item.__editorItemTitle) }}>
                            <h3>
                                <span><RichText text={ item.__editorItemTitle } /></span>
                                {
                                    current == item.__editorItemTitle ?
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 15.9859L12 8L20 15.9859" stroke="#1E1D1D" strokeMiterlimit="10"/></svg>
                                    :
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8.01414L12 16L4 8.01413" stroke="#1E1D1D" strokeMiterlimit="10"/></svg>
                                }
                            </h3>
                            <div className={styles.answer}>
                                <RichText text={ item.answer } />
                            </div>
                        </div>
                    ))
            }
        </div>
    )
}

Faq.schema = {
    title: "FAQ",
    type: "object",
    properties: {
        title: {
            title: "Título",
            type: "string"
        },
        questions: {
            type: "array",
            title: "Items",
            items: {
                properties: {
                    __editorItemTitle: {
                        title: "Pergunta",
                        type: "string"
                    },
                    answer: {
                        title: "Resposta",
                        type: "string",
                        widget: {
                            'ui:widget': 'textarea',
                        },
                    }
                }
            }
        }
    }
}

export default Faq