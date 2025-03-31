import React, { useState, useEffect } from "react"
import Item from "./Item"

import { useCssHandles } from 'vtex.css-handles'
import "../../../../styles/css/header.menu.css"


const Submenu = (props) => {
  
    const [ link, setLink ] = useState(null)
    const [ subCategories, setSubCategories ] = useState(props?.subItens?.length > 0 ? props?.subItens : null)
    const [ current, setCurrent ] = useState(null)

    const windowWidth = window && window?.innerWidth < props.config.breakpoint
	const path = window && window?.location?.pathname

    const CSS_HANDLES = ['submenuItem', `submenuItemLevel${props.level}`,'submenuItemLink', 'wrapperItem', 'active', 'subMenuWrapper', `subMenuWrapperLevel${props.level}`, 'backButton', 'open', 'icon', `submenuItemLinkLevel${props.level}`]
	const  { handles }  =  useCssHandles ( CSS_HANDLES )

    useEffect(()=> {
        
        if(props.submenu.isCategory) {

            let filterCategorie = props.categories?.filter(item => {
                if(item.id == props.submenu.url)
                    return item
            })

            if(filterCategorie && filterCategorie.length > 0) {

                setLink(filterCategorie[0].href)

                if(props.submenu.hasChildren) {
                    if(filterCategorie[0].children.length > 0) {
                        let sortCategories = filterCategorie[0].children.sort((a, b) => a.name.localeCompare(b.name));
                        setSubCategories(sortCategories)
                    }
                }
            }

        } else {
            setLink(props.submenu.url ? props.submenu.url : props.submenu.href)
        }

    }, [props])

    const name = props.submenu.__editorItemTitle ? props.submenu.__editorItemTitle : props.submenu.name
    const compare = subCategories?.length > 0 || props?.submenu?.submenu?.length > 0

    return(
        <li data-level={props.level} className={`${handles.submenuItem} ${handles[`submenuItemLevel${props.level}`]} ${current == link && handles.active} ${subCategories?.length > 0 || props?.submenu?.submenu?.length > 0 && handles.hasChildren}`} data-item={name}>
            <div className={handles.wrapperItem}>
                <a href={link} className={`${handles.submenuItemLink} ${handles[`submenuItemLinkLevel${props.level}`]}`}>{ name }</a>
                { 
                    windowWidth && compare && 
                        <button className={handles.open} onClick={ 
                            (e)=> { 
                                setCurrent(current != link ? link : null); 
                                props.setTitle(current != link ? {...props.title, [props.level]: name } : null); 
                                props.setCurrentLevel(props.level)
                            }}
                        >
                            <img className={handles.icon} src={ current == link ? props.config.iconMinus : props.config.iconPlus } alt={name}  />
                        </button> 
                }
            </div>
            {
                    subCategories?.length > 0 ?
                        <ul data-level={props.level + 1} className={`${handles.subMenuWrapper} ${handles[`subMenuWrapperLevel${props.level + 1}`]}`}>
                            { windowWidth && current == link && props.config.template == "cortina" && <button className={handles.backButton} onClick={ ()=> { setCurrent(null); props.setCurrentLevel(props.level - 1); }}><img src={props.config.iconBack} alt="Voltar"  /></button> }
                            {
                                subCategories?.map((submenu, key) => (
                                    <Item key={key} submenu={submenu} categories={props.categories} subItens={submenu.children} config={props.config} setTitle={props.setTitle} level={props.level + 1} setCurrentLevel={props.setCurrentLevel} />
                                ))
                            }
                        </ul>
                    :
                    props?.submenu?.submenu?.length > 0 &&
                        <ul data-level={props.level + 1} className={`${handles.subMenuWrapper} ${handles[`subMenuWrapperLevel${props.level}`]}`}>
                            { windowWidth && current == link && props.config.template == "cortina" && <button className={handles.backButton} onClick={ ()=> { setCurrent(null); props.setCurrentLevel(props.level - 1); }}><img src={props.config.iconBack} alt="Voltar"  /></button> }
                            {
                                props?.submenu?.submenu?.map((submenu, key) => (
                                    <Item key={key} submenu={submenu} categories={props.categories} config={props.config} setTitle={props.setTitle} level={props.level + 1} setCurrentLevel={props.setCurrentLevel} />
                                ))
                            }
                        </ul>
            }
        </li>
    )
}

export default Submenu;