import React from 'react'
import { schema } from './schema'
import BlockRenderer from './BlockRenderer'

import '../../../styles/css/pages.page-manager.css'

const PageManager = ({disabledDev, sections, ListContext, SearchCustomQuery}) => {
    if(window && window?.location?.href?.indexOf("debugPageManager") != -1)
        console.log("PageManager:", JSON.stringify(sections), sections)
    
    return (
        <div style={{height: '100%'}}>
            {sections && sections.length > 0 && sections.map((section, key)=>(
                <BlockRenderer section={section} key={key} ListContext={ListContext} SearchCustomQuery={SearchCustomQuery} disabledDev={disabledDev}/>
            ))}
        </div>
    )
}

PageManager.schema = schema

export default PageManager