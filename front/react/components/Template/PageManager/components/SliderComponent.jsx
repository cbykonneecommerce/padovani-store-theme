import React, {memo} from 'react'
import { SliderLayout } from 'vtex.slider-layout'
import { index as RichText } from 'vtex.rich-text'
import { useCssHandles } from 'vtex.css-handles'

const SliderComponent = memo(({ section, ListContext }) => {
    const {
        cards,
        images,
        itemsPerPageDesk,
        itemsPerPageTablet,
        itemsPerPagePhone,
        timeout, infinite,
        stopOnHover,
        showPaginationDots,
        showNavigationArrows,
        sliderType,
        listContext
    } = section;
    const typeClass = `slider-${sliderType}`

    const CSS_HANDLES = [
        'page-manager__slider',
        'page-manager__slider-container',
        'slider__card-container',
        'pageManagerRichText',
        'left',
        'center',
        'right',
        'verticalcenter',
        'verticalflex-start',
        'verticalflex-end',
        'horizontalflex-start',
        'horizontalcenter',
        'horizontalflex-end',
        'card__image-container',
        'card__image',
        'card__link-container',
        'card__link',
        `${typeClass}`,
        'image__image-container',
        'image__label',
        'image__picture',
        'image__image-hover',
        'opacity',
        'background-white',
        'background-blue',
        'background-grey'
    ]
    const { handles } = useCssHandles(CSS_HANDLES)

    const hasTimeout = timeout ? { timeout: timeout * 1000, stopOnHover: stopOnHover ?? false } : null;

    const sliderConfigs = {
        infinite: infinite ?? false,
        showNavigationArrows: showNavigationArrows ?? 'always',
        showPaginationDots: showPaginationDots ?? 'always',
        itemsPerPage: {
            desktop: itemsPerPageDesk ?? 1,
            tablet: itemsPerPageTablet ?? 1,
            phone: itemsPerPagePhone ?? 1
        },
        autoplay: hasTimeout
    };

    const CardComponent = ({ card }) => {
        const { textAlign, horizontalAlignBlock, verticalAlignBlock, altImage, backgroundColor, } = card
        const alignText = textAlign ?? 'left'
        const horizontalAlign = horizontalAlignBlock ? `horizontal${horizontalAlignBlock}` : 'horizontalcenter'
        const verticalAlign = verticalAlignBlock ? `vertical${verticalAlignBlock}` : 'verticalcenter'

        return (
            <div className={`${handles['slider__card-container']} ${handles[backgroundColor]} ${handles[horizontalAlign]} ${handles[verticalAlign]}`}>
                <div className={handles['card__image-container']}>
                    <img className={handles['card__image']} src={card.image.imageUrl} alt={altImage} />
                </div>
                <div className={`${handles.pageManagerRichText} ${handles[alignText]}`}>
                    <RichText text={card.text} />
                </div>
                {card?.buttonUrl &&
                    <div className={handles['card__link-container']}>
                        <a className={handles['card__link']} href={card.buttonUrl} target={card.target ? '_blank' : '_self'}>{card.buttonText}</a>
                    </div>
                }
            </div>
        );
    };

    const ImageComponent = ({ image }) => {
        const { imageDesktop, imageMobile, label, url, target, hoverEffect, altImage } = image
        const hover = hoverEffect ?? 'disabled'
        const imageHover = image?.image?.imageHover

        return (
            <div className={handles['image__image-container']}>
                {url ?
                    <>
                        <a href={url} target={target ? '_blank' : '_self'}>
                            <picture className={`${handles['image__picture']} ${hover === 'opacity' ? handles['opacity'] : ''}`}>
                                {imageMobile &&
                                    <source media="(max-width:768px)" alt={altImage} srcset={imageMobile} />
                                }
                                <img src={imageDesktop} alt={altImage} />
                            </picture>
                            {hover === "image-hover" && imageHover &&
                                <picture className={handles['image__image-hover']}>
                                    <img src={imageHover} alt="image-hover" />
                                </picture>
                            }
                            {label &&
                                <p className={handles['image__label']}>{label}</p>
                            }
                        </a>
                    </>
                    :
                    <>
                        <picture className={`${handles['image__picture']} ${hover === 'opacity' ? handles['opacity'] : ''}`}>
                            {imageMobile &&
                                <source media="(min-width:768px)" alt={altImage}  srcset={imageMobile} />
                            }
                            <img src={imageDesktop} alt={altImage}  />
                        </picture>
                        {hover === "image-hover" && imageHover &&
                            <picture className={handles['image__image-hover']}>
                                <img src={imageHover} alt="image-hover" />
                            </picture>
                        }
                        {label &&
                            <p className={handles['image__label']} >{label}</p>
                        }
                    </>
                }
            </div>
        );
    };

    const ProductComponent = memo(({ listContext, ListContext }) => {
        const category = listContext?.category ?? ''
        const collection = listContext?.collection ?? ''
        const orderBy = listContext?.orderby ?? "OrderByTopSaleDESC"
        const hideUnavailableItems = listContext?.hideUnavailableItems ?? false
        const maxItems = listContext?.maxItems ?? 10

        return (
            <>
                <ListContext
                    id="list-context.product-list"
                    category={category}
                    collection={collection}
                    orderBy={orderBy}
                    hideUnavailableItems={hideUnavailableItems}
                    maxItems={maxItems}
                />
            </>
        )
    });



    const renderSliderContent = () => {
        switch (sliderType) {
            case 'card':
                return cards?.map((card, subKey) => <CardComponent key={subKey} card={card} />);
            case 'image':
                return images?.map((image, subKey) => <ImageComponent key={subKey} image={image} />);
            case 'product':
                return <ProductComponent listContext={listContext} ListContext={ListContext} />
            default:
                return null;
        }
    };

    return (
        <div className={handles['page-manager__slider']}>
            <div className={`${handles['page-manager__slider-container']} ${handles[typeClass]}`}>
                <SliderLayout {...sliderConfigs}>
                    {renderSliderContent()}
                </SliderLayout>
            </div>
        </div>
    );
});

export default SliderComponent;
