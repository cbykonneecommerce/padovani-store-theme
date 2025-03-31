import React, { memo, useState, useEffect } from "react";
import { usePixel } from "vtex.pixel-manager";
import { FormattedPrice } from 'vtex.formatted-price';
import { useOrderItems } from 'vtex.order-items/OrderItems';

import { useBuyTogether } from "../context/BuyTogetherProvider";

import Loading from "../../../../UI/Loading/Loading";

import styles from "../../../../styles/css/landing.page-buy-together.css";

function AddToCart() {
    const [isLoading, setIsLoading] = useState(false)
    const [discount, setDiscount] = useState(0);
    const { push } = usePixel();
    const { addItems } = useOrderItems();
    const { selectedProducts: selectedSuggestions, totalPriceProductsSeleted } = useBuyTogether();
    
    async function handleAddToCart() {
        if (!selectedSuggestions?.length) {
            return;
        }
        setIsLoading(true);

        const suggestionsToCart = selectedSuggestions.map((suggestion) => {
            return {
                id: Number(suggestion.id),
                seller: Number(suggestion.sellerId),
                quantity: Number(suggestion.quantity),
            };
        });

        const items = suggestionsToCart;
  
        const options = {
            allowedOutdatedData: ['paymentData'],
          }

        await addItems(items, {
            ...options,
        });
        
        push({ event: "addToCart" });
        setIsLoading(false);
    };

    useEffect(() => {
        setDiscount(totalPriceProductsSeleted?.listPrice - totalPriceProductsSeleted?.price);
    }, [totalPriceProductsSeleted])
 
    return (
        <div className={styles.BuyAreaContainer} >
            <p className={styles.BuyAreaText} >Compre o ambiente Completo</p>

            {discount > 0 && (
                <p className={styles.BuyAreaTextInfo}>Levando esses {selectedSuggestions?.length} produtos você economiza <FormattedPrice value={discount}/> </p>
            )}
            
            <div className={styles.BuyAreaActionsContainer} >
                {totalPriceProductsSeleted?.price > 0 && (
                    <p className={styles.BuyAreaPriceContainer}>
                        <span className={styles.productPriceCode}>
                            <FormattedPrice value={totalPriceProductsSeleted?.listPrice} />
                        </span>
                        <span className={styles.BuyAreaPrice}>
                            <FormattedPrice value={totalPriceProductsSeleted?.price} />
                        </span>
                    </p>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSuggestions?.length}
                    title={!selectedSuggestions?.length ? "Selecione produtos para comprar" : 0}
                    className={
                        styles.BuyAreaAddToCart +
                        ` ${
                            selectedSuggestions?.length == 0 &&
                            styles.BuyAreaAddToCartDisabled
                        }`
                    }>
                    {isLoading ? <Loading /> : "Adicionar ao carrinho"}
                </button>
            </div>
        </div>
    );
}

export default memo(AddToCart);
