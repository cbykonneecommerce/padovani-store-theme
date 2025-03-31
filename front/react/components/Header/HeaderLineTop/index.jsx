import React from 'react'
import { schema } from './schema'
import { useCssHandles } from 'vtex.css-handles'
import { index as RichText } from 'vtex.rich-text'
import { useRuntime } from 'vtex.render-runtime'

import '../../../styles/css/header.header-top-line.css'
import './global.css'

const HeaderLineTop = ({ linksArray, socialMedia }) => {
    const { deviceInfo } = useRuntime()
    const { isMobile } = deviceInfo
    const CSS_HANDLES = ['headerLineTop', 'headerLineTopContainer', 'headerLineTopLinkWrapper', 'headerLineTopLink', 'headerLineTopMediaText', 'headerLineTopMediaContainer', 'headerLineTopMediaWrapper', 'headerLineTopMediaLink']
    const { handles } = useCssHandles(CSS_HANDLES)

    return (
        <div className={handles.headerLineTop}>

            {linksArray?.length > 0 && linksArray.map((link, key) => {

                return (
                    <>
                        <div key={key} className={handles.headerLineTopLinkWrapper}>
                            <a className={`${handles.headerLineTopLink} link-${key}`} href={link.url} target={link.target ? '_blank' : '_self'}>
                                {link.iconArea && link.iconArea.icon &&
                                    <>
                                        <img src={link.iconArea.icon} alt="icon" />
                                    </>
                                }
                                <RichText text={link.__editorItemTitle} />
                            </a>
                        </div>
                    </>
                )
            })}
            {!isMobile &&
                <>
                    <div className={handles.headerLineTopMediaContainer}>
                        {socialMedia?.enableMedia && socialMedia?.medias.length > 0 &&
                            <>
                                <div className={handles.headerLineTopMediaText}>{socialMedia.text}</div>
                                <div className={handles.headerLineTopMediaWrapper}>
                                    {socialMedia?.medias.map((social) => {

                                        return (
                                            <>
                                                <a className={handles.headerLineTopMediaLink} href={social.url}>
                                                    <img src={social.icon} alt={social.__editorItemTitle} />
                                                </a>
                                            </>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    </div>
                </>
            }
        </div>
    )
}

HeaderLineTop.schema = schema

export default HeaderLineTop