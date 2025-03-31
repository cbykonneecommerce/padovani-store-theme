import React from "react";
import { SliderLayout } from 'vtex.slider-layout';
import { useDevice } from 'vtex.device-detector';
import { useProduct } from "vtex.product-context"

import styles from "../../styles/css/product.product-types.css";

import Skeleton from "../../UI/Skeleton";

const ProductTypes = ({ dataType }) => {
    const context = useProduct();

    if (dataType.length < 1) return <></>;
    const { isMobile } = useDevice();

    const sliderLayoutConfig = {
        itemsPerPage: {
            desktop: 4,
            phone: 1,
        },
        infinite: false,
        showNavigationArrows: 'always',
        showPaginationDots: 'never',
        usePagination: true,
        orientation: 'horizontal',
    };

    const sliderLayoutConfigMobile = {
        itemsPerPage: {
            desktop: 4,
            tablet: 1,
            phone: 1,
        },
        infinite: true,
        showNavigationArrows: "always",
        showPaginationDots: "never",
        usePagination: true,
        centerMode: "to-the-left",
        centerModeSlidesGap: 45
    };

    const currentSliderLayoutConfig = isMobile ? sliderLayoutConfigMobile : sliderLayoutConfig;

    return (
        <>
            {dataType.map(element => (
                element.id == context?.product?.categoryId && (
                    <section key={element.id} className={styles.ProductTypesContainer} style={{ backgroundImage: `url(${element.imageBg})` }}>
                        <h2 className={styles.ProductTypesTitle}>{element.title}</h2>

                        <div className={styles.ProductTypesCardContainer}>
                            <SliderLayout {...currentSliderLayoutConfig}>
                                {element.data.map(item => (
                                    <Skeleton key={item.title} height={440}>
                                        <a href={item.linkElement} aria-label={`Navegue até os produtos de ${item.title}`} className={styles.ProductTypesCardWrapper}>
                                            <figure>
                                                <img src={item.image} alt={`Foto da imagem de exemplo do produto ${item.title}`} loading="lazy" />
                                            </figure>
                                            <figcaption>
                                                <h3>{item.title}</h3>
                                                <p>{item.info}</p>
                                            </figcaption>
                                            <a href={item.linkElement} aria-label={`Navegue até os produtos de ${item.title}`} >{item.textButton}</a>
                                        </a>
                                    </Skeleton>
                                ))}
                            </SliderLayout>
                        </div>
                    </section>
                )
            ))}
        </>
    );
}

ProductTypes.schema = {
    title: "Tipos de Produto",
    type: "object",
    properties: {
        dataType: {
            type: "array",
            title: "Tipos de Produto",
            items: {
                properties: {
                    title: {
                        title: "Título",
                        type: "string"
                    },
                    imageBg: {
                        title: "Imagem de background",
                        type: "string",
                        widget: {
                            'ui:widget': 'image-uploader',
                        }
                    },
                    id: {
                        title: "Id da categoria",
                        type: "string",
                        description: "Id para limitar o bloco somente nos produtos com a categoria correta"
                    },
                    data: {
                        type: "array",
                        title: "Tipos de Produto",
                        items: {
                            properties: {
                                image: {
                                    title: "Imagem",
                                    type: "string",
                                    widget: {
                                        'ui:widget': 'image-uploader',
                                    }
                                },
                                title: {
                                    title: "Titulo",
                                    type: "string"
                                },
                                info: {
                                    title: "Informacão",
                                    type: "string"
                                },
                                textButton: {
                                    title: "Informacão",
                                    type: "string",
                                    widget: {
                                        'ui:widget': 'textarea',
                                    }
                                },
                                linkElement: {
                                    title: "Link",
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export default ProductTypes;
