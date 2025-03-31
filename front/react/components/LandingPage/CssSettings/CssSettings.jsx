import React, { useEffect } from 'react';
import waitForEl from '../../../utils/waitForEl';

const CssSettings = (props) => {
  const {
    bgcolor,
    titleColor,
    bgSeeMoreColor,
    textSeeMoreColor,
    bgFilter,
    titleFilterColor,
    itemFilterColor,
    itemFilterDotColor
  } = props;

    const stylesMap = [
        {
            classes: ['.padovani-basic-0-x-ListProductContainer', '.vtex-flex-layout-0-x-flexRow--main-section-campaign'],
            property: 'backgroundColor',
            value: bgcolor,
        },
        {
            classes: ['.padovani-basic-0-x-ListProductTitle'],
            property: 'color',
            value: titleColor,
        },
        {
            classes: ['.padovani-basic-0-x-ListProductTitleBar'],
            property: 'backgroundColor',
            value: titleColor,
        },
        {
            classes: ['.vtex-search-result-3-x-buttonShowMore button'],
            property: 'backgroundColor',
            value: bgSeeMoreColor,
        },
        {
            classes: ['.vtex-search-result-3-x-buttonShowMore button'],
            property: 'color',
            value: textSeeMoreColor,
        },
        {
            classes: ['.padovani-basic-0-x-FilterCustomContainer'],
            property: 'backgroundColor',
            value: bgFilter,
        },
        {
            classes: ['.padovani-basic-0-x-FilterCustomContainer button', '.padovani-basic-0-x-FilterCustomContainer button svg'],
            property: 'color',
            value: titleFilterColor,
        },
        {
            classes: ['.padovani-basic-0-x-FilterCustomItemLink'],
            property: 'color',
            value: itemFilterColor,
        },
        {
            classes: ['.padovani-basic-0-x-FilterCustomMarker'],
            property: 'backgroundColor',
            value: itemFilterDotColor,
        },
  ];

    const applyStyles = (selector, property, value) => {
        waitForEl(selector).then(() => {
            const elements = document.querySelectorAll(selector);
            
            if (elements.length > 0) {

                Array.from(elements).forEach((element) => {
                    element.style[property] = value;
                });
            }
        });
    };

    const setSeeMoreColor = () => {
        waitForEl(".vtex-search-result-3-x-buttonShowMore button").then(() => {
            setTimeout(() => {
                const buttons = document.querySelectorAll(".vtex-search-result-3-x-buttonShowMore button");

                if (buttons.length > 0) {

                    Array.from(buttons).forEach((element) => {
                        element.style.backgroundColor = bgSeeMoreColor;
                        element.style.color = textSeeMoreColor;
                        
                        element.addEventListener('click', () => {
                            setSeeMoreColor();
                        });
                    });
                    
                }
            }, 1000);
        });
    };

    useEffect(() => {
        stylesMap.forEach(({ classes, property, value }) => {
        classes.forEach((selector) => applyStyles(selector, property, value));
        });

        setSeeMoreColor();
    }, [bgcolor, titleColor, bgSeeMoreColor, textSeeMoreColor, bgFilter, titleFilterColor, itemFilterColor]);

    return <></>;
    
};

export default CssSettings;

CssSettings.schema = {
    title: 'Estilos da Página',
    type: 'object',
    properties: {
        bgcolor: {
            title: "Cor de fundo",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        titleColor: {
            title: "Cor dos titulos",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        bgSeeMoreColor: {
            title: "Cor de fundo do botão de ver mais",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        textSeeMoreColor: {
            title: "Cor do texto do botão de ver mais",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        bgFilter: {
            title: "Cor de fundo do Filtro",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        titleFilterColor: {
            title: "Cor do titulo do Filtro",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        itemFilterColor: {
            title: "Cor dos items do Filtro",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
        itemFilterDotColor: {
            title: "Cor das bolinhas dos items do Filtro",
            type: "string",
            widget: {
                "ui:widget": "color"
            }
        },
    }
}