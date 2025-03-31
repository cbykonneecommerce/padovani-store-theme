import { useLayoutEffect, useEffect } from "react"
import { useRuntime, canUseDOM } from 'vtex.render-runtime'

import styles from "./styles/css/template.scripts.css"

const Scripts = () => {

    if(!canUseDOM) return null
    
    useLayoutEffect(() => {
        if (!document.querySelector("head style#global")) {
            document.querySelector("head").insertAdjacentHTML("beforeend", "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><style id='global'>html {scroll-behavior: smooth;} body::-webkit-scrollbar { width: 12px !important; } a {text-decoration: none; } .vtex-iframe-0-x-container iframe { width: 100%!important; min-height: 450px; border-radius: 10px; }</style>")
        }

    }, [])
    
    useEffect(() => {
        setTimeout(() => {            
            if(document.querySelector(".vtex-flex-layout-0-x-flexRow--header-row-3 > section > div > div > div > div > nav > ul > li:nth-child(7) > a")){
                document.querySelector(".vtex-flex-layout-0-x-flexRow--header-row-3 > section > div > div > div > div > nav > ul > li:nth-child(7) > a").classList.add('wedigi-menu-1-x-itemMenuLink--main-menu-border-custom-item')
            }

            if(document.querySelector("body > div.render-container.render-route-store-product > div > div.vtex-store__template.bg-base > div > div > div > div.vtex-sticky-layout-0-x-wrapper.vtex-sticky-layout-0-x-wrapper--sticky-header > div > div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--header-row-3 > section > div > div > div > div > nav > ul > li:nth-child(7) > a")){
                document.querySelector("body > div.render-container.render-route-store-product > div > div.vtex-store__template.bg-base > div > div > div > div.vtex-sticky-layout-0-x-wrapper.vtex-sticky-layout-0-x-wrapper--sticky-header > div > div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--header-row-3 > section > div > div > div > div > nav > ul > li:nth-child(7) > a").classList.add('wedigi-menu-1-x-itemMenuLink--main-menu-border-custom-item')
            }

            const institucionalLinks = Array.from(document.querySelectorAll('.wedigi-menu-0-x-menuContainer--page-menu-institucional li .wedigi-menu-0-x-itemMenuLink'))
            institucionalLinks.map(link => {
                if(link.href.split('/')[3] == window.location.pathname.replace('/','')){
                    link.style.background = '#08151D';
                }
            });
        }, 2000);
    },[])
    
    return <></>
}

export default Scripts
