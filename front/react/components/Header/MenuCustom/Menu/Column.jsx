import React, { useState, useEffect } from "react"
import Item from "./Item"

import { useCssHandles } from 'vtex.css-handles'
import "../../../../styles/css/header.menu.css"
import { useRuntime } from 'vtex.render-runtime'

const Column = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const { deviceInfo } = useRuntime()
    const { isMobile } = deviceInfo

    const windowWidth = window?.innerWidth < props.config.breakpoint

    const CSS_HANDLES = ['menuColumn', 'hasChildren', 'subMenuWrapper', 'columnLink', 'columnButton', 'active']
    const { handles } = useCssHandles(CSS_HANDLES)

    const [link, setLink] = useState(null)
    const [subCategories, setSubCategories] = useState(props?.subItens?.length > 0 ? props?.subItens : null)
    const [current, setCurrent] = useState(null)

    const path = window && window?.location?.pathname

    useEffect(() => {


        if (props?.column?.isCategory) {

            let filterCategorie = props.categories?.filter(item => {
                if (item.id == props.column.url)
                    return item
            })

            if (filterCategorie && filterCategorie.length > 0) {

                setLink(filterCategorie[0].href)

                if (props.column.hasChildren) {
                    if (filterCategorie[0].children.length > 0) {
                        let sortCategories = filterCategorie[0].children.sort((a, b) => a.name.localeCompare(b.name));
                        setSubCategories(sortCategories)
                    }
                }
            }

            let filterCategorie1 = props.categories?.filter(item => {
                let find = item.children.filter(level1 => {
                    if (level1.id == props.column.url)
                        return level1
                })

                if (find?.length > 0) {
                    let sortCategories = find[0].children.sort((a, b) => a.name.localeCompare(b.name));
                    setSubCategories(sortCategories)
                    setLink(find[0].href)
                }
            })


        } else {
            setLink(props.column.url ? props.column.url : props.column.href)
        }

    }, [props])

    const hasChildrenVerify = windowWidth ? subCategories?.length > 0 || props?.categories?.length > 0 : subCategories?.length > 0 || props?.column?.submenu?.length > 0;
    // const name = props.submenu.__editorItemTitle ? props.submenu.__editorItemTitle : props.submenu.name
    // const compare = subCategories?.length > 0 || props?.submenu?.submenu?.length > 0

    return (
        <div className={`${handles.menuColumn} ${hasChildrenVerify ? handles.hasChildren : ''}`}>
            {(link && link !== '#' && link !== '') && props.column.showTitle &&
                <a href={link} className={`${handles.columnLink}`}>{props.column.showTitle && props.column.__editorItemTitle}</a>
            }
            {props?.categories?.length > 0 && isMobile &&
                <button className={`${handles.columnButton}`} onClick={() => setIsOpen(!isOpen)}>
                    {props.column.__editorItemTitle}
                    <div>
                        {!isOpen &&
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path fill="#181848" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                        }
                        {isOpen &&
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path fill="#181848" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                        }
                    </div>
                </button>
            }
            {
                props?.column?.allCategories ?
                    props?.categories?.length > 0 &&
                    <ul data-level={props.level + 1} className={`${handles.subMenuWrapper} ${isOpen ? handles.active : ''}`}>
                        {
                            props?.categories?.sort()?.map((submenu, key) => (
                                <Item key={key} submenu={submenu} subItens={submenu.children} config={props.config} title={props.title} setTitle={props.setTitle} level={props.level + 1} setCurrentLevel={props.setCurrentLevel} />
                            ))
                        }
                    </ul>
                    :
                    subCategories?.length > 0 ?
                        <ul data-level={props.level + 1} className={`${handles.subMenuWrapper} ${isOpen ? handles.active : ''}`}>
                            {windowWidth && current == link && props.config.template == "cortina" && <button className={handles.backButton} onClick={() => { setCurrent(null); props.setCurrentLevel(props.level - 1); }}><img src={props.config.iconBack} alt="Voltar" /></button>}
                            {
                                subCategories?.map((submenu, key) => (
                                    <Item key={key} submenu={submenu} categories={props.categories} subItens={submenu.children} config={props.config} setTitle={props.setTitle} level={props.level + 1} setCurrentLevel={props.setCurrentLevel} />
                                ))
                            }
                        </ul>
                        :
                        props?.column?.submenu?.length > 0 &&
                        <ul data-level={props.level + 1} className={`${handles.subMenuWrapper} ${isOpen ? handles.active : ''}`}>
                            {
                                props?.column?.submenu?.map((submenu, key) => (
                                    <Item key={key} submenu={submenu} categories={props.categories} config={props.config} title={props.title} setTitle={props.setTitle} level={props.level + 1} setCurrentLevel={props.setCurrentLevel} />
                                ))
                            }
                        </ul>
            }
        </div>
    )
}

export default Column