import React from 'react'
import { index as RichText } from 'vtex.rich-text'
import { useCssHandles } from 'vtex.css-handles'

const BannerComponentBg = ({ section }) => {
  const { image, activeText, __editorItemTitle, richText, textColor, backgroundClor, imageAlign } = section

  if (!section.image || !section.image.imageDesk) return null

  const isFullWidth = image.fullWidth ? 'full-width' : 'container'

  const CSS_HANDLES = ['pageManagerBanner', 'pageManagerPicture', 'pageManagerTextContainer', 'pageManagerRichText', `${imageAlign}` ,`${isFullWidth}`, `${textColor}`]
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
      <div
        className={`${handles.pageManagerBanner} ${handles[isFullWidth]} ${handles[imageAlign]} ${handles[textColor]}`}
          style={{ backgroundColor: backgroundClor }}
      >
      <picture className={handles.pageManagerPicture}>
        {image.imageMob && <source srcset={image.imageMob} media="(max-width:768px)" />}
        <img src={image.imageDesk} alt={__editorItemTitle} />
      </picture>
      {activeText &&
        <div className={handles.pageManagerTextContainer}>
          <div className={`${handles.pageManagerRichText}`}>
            {richText &&
              <RichText text={richText} />
            }
          </div>

        </div>
      }
    </div>
  )
}

export default BannerComponentBg