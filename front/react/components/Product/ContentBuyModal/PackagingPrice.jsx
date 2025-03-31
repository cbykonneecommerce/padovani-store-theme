import React, {useEffect, useState} from "react";
import { useProduct } from "vtex.product-context";
// import { FormattedPrice } from 'vtex.formatted-price'
import { OrderForm } from "vtex.order-manager";

import styles from "../../../styles/css/product.css"

const PackagingPrice = ({qty, isFixed}) => {
    const context = useProduct();
    const [priceSimulate, setPriceSimulate] = useState(null);
    const [fixpriceSim, setFixPriceSim] = useState(null);
    const { useOrderForm } = OrderForm;
    const { orderForm } = useOrderForm();
    const { clientProfileData, shipping, marketingData } = orderForm;
    const multiplier = context?.product?.items[0]?.unitMultiplier;
    const packagingQtd = context?.product?.properties
        ?.find((el) => {
            return el.name === "Peças por Caixa"
        })
        ?.values[0];
    
    function simulateCartWithDelay() {
        const timeoutDelay = 500;
        let timeoutId;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            simulateCart();
        }, timeoutDelay);

        return () => {
            clearTimeout(timeoutId);
        };
    }

    function getMarketingData(data) {
        const marketingDataFirst = data !== null ? Object.values(data) : null;

        const marketingDataSecond = marketingDataFirst?.filter(
            (value) => value !== "MarketingData"
        );
    
        const marketingData =
            marketingDataSecond !== undefined
                ? marketingDataSecond?.join("")?.length > 0
                    ? data
                    : null
                : null;
        
        return marketingData;
    }

    function simulateCart() {
        const options = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "items": [
                    {
                        "id": context?.selectedItem?.itemId,
                        "quantity": qty,
                        "seller": "1"
                    }
                ],
                "country": "BRA",
                "postalCode": "03449-000",
                // "paymentData": {
                //     "payments": [
                //         {
                //             "installments": 1,
                //             "merchantSellerPayments": [
                //                 {
                //                     id: 'PADOVANI',
                //                     installments: 1,
                //                 },
                //             ],
                //             paymentSystem: '125',
                //         },
                //     ],
                // },
                clientProfileData,
                shipping,
                marketingData: getMarketingData(marketingData)
            })
        };

        fetch('/api/checkout/pub/orderForms/simulation/?sc=1', options)
            .then(response => response.json())
            .then(response => {
                const priceVtex = response?.items[0]?.price;
                const unitMultiplier = response?.items[0].unitMultiplier
                const finalPrice = priceVtex * unitMultiplier * qty;

                const totalPriceTruncated = Math.trunc(finalPrice) / 100;
                
                const totalPriceFormated = totalPriceTruncated.toFixed(2).replace('.', ',');
                                
                setPriceSimulate(totalPriceFormated); // Valor formatado para exibição.
                setFixPriceSim(totalPriceTruncated);
            })
    }

    useEffect(simulateCartWithDelay, [qty]);

    if (!packagingQtd || priceSimulate == null || fixpriceSim == null) return <></>
    
    return (
        <>
            <span className={styles["sale_price-wrapper"]}>{isFixed ? fixpriceSim : priceSimulate}</span>
        </>
    );
};

export default PackagingPrice;
