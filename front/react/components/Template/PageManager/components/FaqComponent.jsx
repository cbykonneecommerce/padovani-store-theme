import React from 'react'
import { index as RichText } from 'vtex.rich-text'
import { useCssHandles } from 'vtex.css-handles'
import { SliderLayout } from 'vtex.slider-layout'

const FaqComponent = ({ section }) => {
  const { faq, faqType } = section
  const faqModel = faqType ?? 'model-white'
  const CSS_HANDLES = ['pageManagerFaq', 'pageManagerFaq__itemContainer', 'pageManagerFaqItem', 'pageManagerFaqSummary', 'pageManagerContent', 'pageManagerRichText', 'pageManagerImageContainer', 'hasImage', `${faqModel}`]
  const { handles } = useCssHandles(CSS_HANDLES)
  const sliderConfigs = {
    infinite: true,
    showNavigationArrows: 'always',
    showPaginationDots: 'always',
    itemsPerPage: {
        desktop: 1,
        tablet: 1,
        phone: 1
    }
};

  if (!faq || faq.length === 0) return null

  return (
    <div className={`${handles.pageManagerFaq} ${handles[faqModel]}`}>
      <div className={handles['pageManagerFaq__itemContainer']}>
        {faq?.map((item, key) => (
          <>
            <details className={`${handles.pageManagerFaqItem} ${handles[faqModel]}`}>
              <summary className={handles.pageManagerFaqSummary} key={key}>{item.__editorItemTitle}</summary>
              <div className={handles.pageManagerContent}>
                {item.image.length > 0 &&
                  <SliderLayout {...sliderConfigs}>
                    {item?.image?.map(element => (
                      <div className={handles.pageManagerImageContainer}>
                        <img src={element?.image?.imageUrl} alt="imagem da loja" />
                      </div>
                    ))}
                  </SliderLayout>
                }
                <div className={`${handles.pageManagerRichText} ${item.image && item.image.imageUrl ? handles.hasImage : ''}`}>
                  <RichText text={item.text} />
                </div>
              </div>
            </details>
          </>
        ))}
      </div>
    </div>
  )
}

export default FaqComponent