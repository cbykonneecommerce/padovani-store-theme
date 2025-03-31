import React, {useEffect} from "react";
import { Checkbox, } from 'vtex.styleguide';
import { FormattedPrice } from 'vtex.formatted-price';
import { SliderLayout } from 'vtex.slider-layout';

import { shelfImageSliderLayoutConfig } from "../config/sliderLayout";
import { useBuyTogether } from "../context/BuyTogetherProvider";

import styles from "../../../../styles/css/landing.page-buy-together.css";

const ShelfProduct = ({
    product,
    index
}) => {
    const { onAddSugestion, selectedProducts } = useBuyTogether();

    function filtesIsChecked() {
        return selectedProducts?.find((item) => item.id == product?.items[0]?.itemId)
    }
    
    return (
        <> 
            <section className={styles.BuyTogetherShelfContainer}>    
                <div className={styles.BuyTogetherShelfTop} >
                    <SliderLayout {...shelfImageSliderLayoutConfig}>
                        {product?.items[0]?.images?.map(element => (
                            <img loading="lazy" src={element.imageUrl} alt={element.complementName} key={element.complementName} />
                        ))}
                    </SliderLayout>
                    
                </div>

                <div className={styles.BuyTogetherShelfBottom}> 
                    <h2>{product?.productName}</h2>
                    <div className={styles.BuyTogetherShelfPrices}>
                        <span className={styles.BuyTogetherShelfListPrice}>
                            <FormattedPrice value={product.items[0].sellers[0].commertialOffer.ListPrice} />
                        </span>
                        <span className={styles.BuyTogetherShelfPrice}>
                            <FormattedPrice value={product.items[0].sellers[0].commertialOffer.Price} />
                        </span>
                    </div>
                </div>

                <div className={styles.BuyTogetherShelfButton} >
                <Checkbox
                        checked={filtesIsChecked()}
                        partial={true}
                        id={index}
                        label={filtesIsChecked() ? "Adicionado" : "Adicionar"}
                        name="default-checkbox-group"
                        onChange={(e) => {
                            onAddSugestion(
                                e.target.checked,
                                index
                            )
                        } }
                        value={`option-${index}`}
                    />
                </div>

            </section>
        </>
    )
}

export default ShelfProduct
