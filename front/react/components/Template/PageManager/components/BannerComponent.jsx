import React from 'react'
import { index as RichText } from 'vtex.rich-text'
import { useCssHandles } from 'vtex.css-handles'

const BannerComponent = ({ section }) => {
  const { image, activeText, horizontalAlignBlock, verticalAlignBlock, textAlign, __editorItemTitle, richText, colorWhite, link, textLink, target } = section

  if (!section.image || !section.image.imageDesk) return null

  const alignText = textAlign ?? 'left'
  const horizontalAlign = horizontalAlignBlock ? `horizontal${horizontalAlignBlock}` : 'horizontalcenter'
  const verticalAlign = verticalAlignBlock ? `vertical${verticalAlignBlock}` : 'verticalcenter'
  const isFullWidth = image.fullWidth ? 'full-width' : 'container'
  const colorText = colorWhite ? 'white-color' : 'default-color'

  const CSS_HANDLES = ['pageManagerBanner', 'pageManagerPicture', 'pageManagerTextContainer', 'pageManagerRichText', `${alignText}`, `${horizontalAlign}`, `${verticalAlign}`, `${isFullWidth}`, `${colorText}`, 'buttonLink']
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.pageManagerBanner} ${handles[isFullWidth]}`}>
      <picture className={handles.pageManagerPicture}>
        {image.imageMob && <source srcset={image.imageMob} media="(max-width:768px)" />}
        <img src={image.imageDesk} alt={__editorItemTitle} />
      </picture>
      {activeText &&
        <div className={handles.pageManagerTextContainer}>
          <div className={`${handles.pageManagerRichText} ${handles[alignText]} ${handles[horizontalAlign]} ${handles[verticalAlign]} ${handles[colorText]}`}>
            {richText &&
              <RichText text={richText} />
            }
            {link && textLink &&
              <>
                <a href={link} className={handles.buttonLink} target={target ? '_blank' : '_self'}>
                  {textLink}
                </a>
              </>
            }
          </div>

        </div>
      }
    </div>
  )
}

export default BannerComponent