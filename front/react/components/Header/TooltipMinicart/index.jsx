import React, { useEffect, useState } from "react";
import IconAlert from "./IconAlert";
import { ItemContext } from "vtex.product-list";
import { FormattedPrice } from 'vtex.formatted-price';
import { OrderForm } from "vtex.order-manager";
import styles from "../../../styles/css/header.tooltip-minicart.css"


const TooltipMinicart = () => {
    const { useItemContext } = ItemContext;
    const { orderForm } = OrderForm.useOrderForm();
    const { item, loading } = useItemContext();
    const [hasPorcel, setHasPorcel] = useState(false);
    const prodId = item.productId;
    const basePrice =  item.price / 100;

    async function getInfoProd() {
        fetch('/api/catalog_system/pub/products/search?fq=productId:' + prodId)
            .then(response => response.json())
            .then(response => {

                setHasPorcel(response[0]["Peças por Caixa"] ? true : false)
            })
    }


    useEffect(() => {
        getInfoProd();

    }, [item, hasPorcel])


    if (loading || !hasPorcel) {
        return <></>;
    }
    
    return (
        <div className={styles.WrapperToltipInfos}>

            <div className={styles.InfosMetro}>
                <span>
                 {item.unitMultiplier} m²
                </span>
            </div>

            <div className={styles.Tooltip}>
                <span className="c-on-base pointer">
                    <IconAlert />
                </span>

                <div className={styles.TooltipMenssage}>
                    Cada caixa possui <strong> {item.unitMultiplier} m² </strong> onde o <strong> m² </strong> sai por  
                    <strong>  <FormattedPrice value={basePrice} /></strong> 
                </div>
            </div>
        </div>
    );
}

export default TooltipMinicart