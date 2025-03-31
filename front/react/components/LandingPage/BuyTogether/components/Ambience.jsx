import React from "react";
import { SliderLayout } from 'vtex.slider-layout';

import { shelfsliderLayoutConfig } from "../config/sliderLayout"

import ShelfProduct from "./Shelf";
import ModalProduct from "./ModalProduct";

import styles from "../../../../styles/css/landing.page-buy-together.css";

const Ambience = ({ ambience, index }) => {
    if(!ambience) return <></>

    return (
        <li className={styles.ImageAmbienceWrapper} key={index}>
            <div className={styles.ImageAmbienceContainer}>
                <img src={ambience.image} alt={ambience.imageAlt} />
                <ul>
                    {ambience?.products?.map((product, productIndex) => {
                        if (product?.productId !== undefined) {
                            return (
                                <ModalProduct
                                    product={product}
                                    index={productIndex}
                                    position={{
                                        x: product.xPosition,
                                        y: product.yPosition
                                    }}
                                />
                            )   
                        }
                    })}
                </ul>
            </div>
            
            <ul className={styles.ShelfList}>
                <SliderLayout {...shelfsliderLayoutConfig}>
                    {ambience?.products?.map((product, productIndex) => {
                        if (product?.productId !== undefined) { 
                            return (
                                <ShelfProduct product={product} index={productIndex} />
                            )
                        }
                    })}
                </SliderLayout>
            </ul>
        </li>
    );
};

export default Ambience;
