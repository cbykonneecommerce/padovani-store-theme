import { useState, useEffect } from "react"
import styles from "../../styles/css/product.tabs-description.css"
import { useProduct } from "vtex.product-context"

const TabsDescriptions = (props) => {

    if(props?.tabs?.length == 0) return null

    const [ tabs, setTabs ] = useState(null)
    const [ activeTab, setActiveTab ] = useState(null)

    const context = useProduct()
    const description = context?.product?.description
    
    useEffect(() => {

        let prepareTabs = []

        props?.tabs?.map(item => {
            
            context?.product?.properties.map(find => {

                let filter = prepareTabs.filter(filterItem => { if(filterItem.title == item.__editorItemTitle) { return item } })

                if(item.content == "description" && filter?.length == 0) {
                    prepareTabs.push({ title: item.__editorItemTitle, content: context.product.description })
                } else if(item.content == find.name) {
                    prepareTabs.push({ title: item.__editorItemTitle, content: find.values[0]})
                }
            })

            setTabs(prepareTabs)
        })

    }, [context])

    if(tabs == null) return null

    return(
        <div className={`${styles[props.blockClass]} ${styles.wrapperDescriptions}`}>
            {
                props.template == "text" &&
                    <>
                        {
                            tabs.map((item) => (
                                <div data-title={item.title} className={`${styles.contentText}`} dangerouslySetInnerHTML={{ __html: `${item.title} ${item.content}` }} />
                            ))
                        }
                    </>
            }
            {
                props.template == "accordion" &&
                    <>
                        <ul className={styles.menuDescriptions}>
                            {
                                tabs.map((item) => (
                                    <li className={styles[activeTab == item.title && "active"]} onClick={ () => { activeTab == item.title ? setActiveTab(null) : setActiveTab(item.title) }}>
                                        <div className={styles.headerTab}>
                                            <span>{ item.title }</span>
                                            <strong>{ activeTab == item.title ? "-" : "+" }</strong>
                                        </div>
                                        <div className={styles.contentDescriptions}>
                                            {
                                                tabs.map((item) => (
                                                    activeTab == item.title &&
                                                        <div className={`${styles.content} ${styles[activeTab == item.title && "active"]}`} dangerouslySetInnerHTML={{ __html: item.content }} />
                                                ))
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </>
                }
        </div>
    )
}

export default TabsDescriptions