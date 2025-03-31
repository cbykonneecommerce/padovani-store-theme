import React, { useState } from 'react'
import { index as RichText } from 'vtex.rich-text'
import { useCssHandles } from 'vtex.css-handles'

const RichTextComponent = ({ section }) => {
  const { richText, textAlign, hasSeeMoreButton } = section
  const alignText = textAlign ?? 'left'
  const CSS_HANDLES = ['pageManagerRichText', `${alignText}`]
  const { handles } = useCssHandles(CSS_HANDLES)

  const [expanded, setExpanded] = useState(false)

  const handleSeeMoreClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={`${handles.pageManagerRichText} ${handles[alignText]}`}>
      
      <RichText
        text={
        hasSeeMoreButton ? expanded ? richText : richText?.substring(0, 200)  :
        richText
        }
      />
      
      {hasSeeMoreButton && richText?.length > 200 && (
        <button onClick={handleSeeMoreClick}>
          {expanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}

export default RichTextComponent