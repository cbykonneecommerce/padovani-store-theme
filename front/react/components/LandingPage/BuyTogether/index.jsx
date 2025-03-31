import React, { useEffect, useState } from "react";
import { SliderLayout } from 'vtex.slider-layout';

import { ambiencesliderLayoutConfig } from "./config/sliderLayout";
import BuyTogetherProvider from "./context/BuyTogetherProvider";
import { BuyTogetherService } from "./service/BuyTogetherService";

import Ambience from "./components/Ambience";
import AddToCart from "./components/AddToCart";

import styles from "../../../styles/css/landing.page-buy-together.css";

const BuyTogether = (props) => {
    const [ambiencesWithProducts, setAmbiencesWithProducts] = useState([]);

    if (window && window?.location?.href?.indexOf("debugBuyTogether") != -1) {
        console.log("BuyTogether:", JSON.stringify(props), props)
    }

    async function getProductsInfo() {
        const service = new BuyTogetherService();
        const ambiencesWithProductsInfo = [];

        for (const ambience of props.ambiences) {
            const productsInfo = [];

            for (const product of ambience.products) {
                try {
                    if (product.sku !== undefined) {
                        const info = await service.getProductBySku(product.sku);
                        productsInfo.push({ ...info, xPosition: product.xPosition, yPosition: product.yPosition });
                    }
                } catch (error) {
                    console.error(`Erro ao buscar informações para o SKU ${product.sku}:`, error);
                }
            }

            ambiencesWithProductsInfo.push({ ...ambience, products: productsInfo });
        }

        setAmbiencesWithProducts(ambiencesWithProductsInfo);
    }

    useEffect(() => {
        getProductsInfo();
    }, []);

    useEffect(() => {
        function reqWithDelay() {
            const timeoutDelay = 800;
            let timeoutId;
    
            clearTimeout(timeoutId);
    
            timeoutId = setTimeout(() => {
                getProductsInfo();
            }, timeoutDelay);
    
            return () => {
                clearTimeout(timeoutId);
            };
        }

        reqWithDelay();
    }, [props]);

    if (ambiencesWithProducts.length < 1) return <></>;

    return (
        <section className={styles.BuyTogetherContainer}>
            <ul>
                <SliderLayout {...ambiencesliderLayoutConfig}>
                    {ambiencesWithProducts.map((ambience, index) => (
                        <BuyTogetherProvider products={ambience.products}>
                                < Ambience
                                    ambience={ambience}
                                    index={index}
                                />   
                            < AddToCart />
                        </BuyTogetherProvider>
                    ))}
                </SliderLayout>
            </ul>
        </section>
    );
};

BuyTogether.schema = {
    title: "Compre Junto",
    type: "object",
    properties: {
        ambiences: {
            title: 'Ambientes',
            type: 'array',
            items: {
                title: "Ambiente",
                type: 'object',
                properties: {
                    image: {
                        title: 'Foto do ambiente',
                        type: 'string',
                        widget: {
                            'ui:widget': 'image-uploader',
                        },
                    },
                    imageAlt: {
                        title: "Texto da imagem",
                        type: "string",
                        description: "Descreva a imagem. Ajuda na acessibilidade e SEO",
                        widget: {
                            'ui:widget': 'textarea',
                        }
                    },
                    products: {
                        title: 'Produtos',
                        type: 'array',
                        items: {
                            title: "Produto",
                            type: 'object',
                            properties: {
                                sku: {
                                    title: "Sku do produto",
                                    type: "integer"
                                },
                                yPosition: {
                                    title: "Posição Vertical (eixo Y)",
                                    type: "integer"
                                },
                                xPosition: {
                                    title: "Posição Horizontal (eixo X)",
                                    type: "integer"
                                }
                            },
                        },
                    }
                },
            },
        },
    }
}

export default BuyTogether;
