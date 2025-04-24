import React from 'react'
import BlockRenderer from './BlockRenderer'
import { schema } from './schema'

import '../../../styles/css/pages.page-manager.css'

const PageManager = ({
  disabledDev,
  sections,
  ListContext,
  SearchCustomQuery,
}) => {
  return (
    <div style={{ height: '100%' }}>
      {sections &&
        sections.length > 0 &&
        sections.map((section, key) => (
          <BlockRenderer
            section={section}
            key={key}
            ListContext={ListContext}
            SearchCustomQuery={SearchCustomQuery}
            disabledDev={disabledDev}
          />
        ))}
    </div>
  )
}

PageManager.schema = schema

export default PageManager
