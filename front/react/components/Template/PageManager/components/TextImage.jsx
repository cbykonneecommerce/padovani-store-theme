import React from 'react';
import { index as RichText } from 'vtex.rich-text';
import { useCssHandles } from 'vtex.css-handles';
import { useDevice } from 'vtex.device-detector';
import { SliderLayout } from 'vtex.slider-layout';

const TextImage = ({ section }) => {
    const CSS_HANDLES = ['TextImageContainer', 'TextImageItem', 'left', 'top', 'right', 'text-center', 'text-right', 'text-left'];
    const { handles } = useCssHandles(CSS_HANDLES);
    const { isMobile } = useDevice();

    const sliderLayoutConfig = {
        itemsPerPage: {
            desktop: 4,
            tablet: 1,
            phone: 1,
        },
        infinite: true,
        showNavigationArrows: "always",
        showPaginationDots: "never",
        usePagination: true,
    };
    
    if (section?.items?.length < 1) return <></>;

    return (
        isMobile ? (
            <ul className={`${handles.TextImageContainer}`}>
                <SliderLayout {...sliderLayoutConfig}>
                    {section?.items?.map((element, index) => (
                        <li
                            style={{
                                border: element.hasBorder ? '1px solid #bebebe' : 'none',
                            }}
                            className={`${handles.TextImageItem} ${handles[element.alignImage]} ${handles[element.alignText]}`} key={index}
                        >
                            {element?.image?.imageUrl && element?.image?.imageAlt && (
                                <img alt={element?.image?.imageAlt} src={element?.image?.imageUrl} loading="lazy" />
                            )}
                            <RichText text={element.text} />
                        </li>
                    ))}
                </SliderLayout>
            </ul>
        ) : (
            <ul className={`${handles.TextImageContainer}`}>
                {section?.items?.map((element, index) => (
                    <li
                        style={{
                            border: element.hasBorder ? '1px solid #bebebe' : 'none',
                            minHeight: element.minHeight ? `${element.minHeight}px` : '320px',
                            width: element.width ? `${element.width}%` : '50%',
                        }}
                        className={`${handles.TextImageItem} ${handles[element.alignImage]} ${handles[element.alignText]}`} key={index}
                    >
                        {element?.image?.imageUrl && element?.image?.imageAlt && (
                            <img alt={element?.image?.imageAlt} src={element?.image?.imageUrl} loading="lazy" />
                        )}
                        <RichText text={element.text} />
                    </li>
                ))}
            </ul> 
        )
    );
}

export default TextImage;
