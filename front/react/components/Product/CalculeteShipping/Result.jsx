import React from "react";
import { FormattedPrice } from 'vtex.formatted-price'
import styles from "../../../styles/css/product.calculate-shipping.css"

const Result = ({infShip, error}) => {

    let elNormal = infShip.filter((item, _idx) => item.name.indexOf("SEDEX") > -1 || item.name.indexOf("Piso") > -1 || item.name.indexOf("Normal") > -1 || item.name.indexOf("Jadlog") > -1 );
    let elExpress = infShip.filter((item, _idx) => item.name.indexOf("Mandae") > -1 || item.name.indexOf("R1") > -1);
    let elPadovani = infShip.filter((item, _idx) => item.name.indexOf("Padovani") > -1);
    let elRetirada = infShip.filter((item, _idx) => item.name.indexOf("Retira") > -1);

    let minNormal = Math.min(...elNormal.map(item => parseInt(item.shippingEstimate.replace("bd", ""))))
    let minExpress = Math.min(...elExpress.map(item => parseInt(item.shippingEstimate.replace("bd", ""))))
    let minPadovani = Math.min(...elPadovani.map(item => parseInt(item.shippingEstimate.replace("bd", ""))))
    let minRetirada = Math.min(...elRetirada.map(item => parseInt(item.shippingEstimate.replace("bd", ""))))

    elNormal = elNormal.filter(item => parseInt(item.shippingEstimate.replace("bd", "")) === minNormal)
    elExpress = elExpress.filter(item => parseInt(item.shippingEstimate.replace("bd", "")) === minExpress)
    elPadovani = elPadovani.filter(item => parseInt(item.shippingEstimate.replace("bd", "")) === minPadovani)
    elRetirada = elRetirada.filter(item => parseInt(item.shippingEstimate.replace("bd", "")) === minRetirada)



    if (!elNormal && elExpress && elPadovani && elRetirada) return <span className={styles.wrapResultShipping}>{error}</span>
    

    return (
        <>
            {
                elNormal ?
                elNormal.map(el => (
                    <div key={el.id} className={` ${styles.wrapInfoResultShipping}`}>
                        <p className={styles.infoResultNameShipping}>
                            Frete Normal
                        </p>
                        <p className={styles.infoResultShipping}>
                            Em até {el.shippingEstimate.replace("bd", "")} dias úteis 
                            <strong>{el.price === 0 ? "GRÁTIS" : <FormattedPrice value={(el.price / 100)} />}</strong>
                        </p>
                    </div>
                ))
                :
                ""
            }
            {
                elExpress ?
                elExpress.map(el => (
                    <div key={el.id} className={` ${styles.wrapInfoResultShipping}`}>
                        <p className={styles.infoResultNameShipping}>
                            Frete Expresso
                        </p>
                        <p className={styles.infoResultShipping}>
                            Em até {el.shippingEstimate.replace("bd", "")} dias úteis 
                            <strong>{el.price === 0 ? "GRÁTIS" : <FormattedPrice value={(el.price / 100)} />}</strong>
                        </p>
                    </div>
                ))
                :
                ""
            }
            {
                elPadovani ?
                elPadovani.map(el => (
                    <div key={el.id} className={` ${styles.wrapInfoResultShipping}`}>
                        <p className={styles.infoResultNameShipping}>
                            Frete Padovani
                        </p>
                        <p className={styles.infoResultShipping}>
                            Em até {el.shippingEstimate.replace("bd", "")} dias úteis 
                            <strong>{el.price === 0 ? "GRÁTIS" : <FormattedPrice value={(el.price / 100)} />}</strong>
                        </p>
                    </div>
                ))
                :
                ""
            }
            {
                elRetirada ?
                elRetirada.map(el => (
                    <div key={el.id} className={` ${styles.wrapInfoResultShipping}`}>
                        <p className={styles.infoResultNameShipping}>
                            Retirada
                        </p>
                        <p className={styles.infoResultShipping}>
                            Em até {el.shippingEstimate.replace("bd", "")} dias úteis 
                            <strong>{el.price === 0 ? "GRÁTIS" : <FormattedPrice value={(el.price / 100)} />}</strong>
                        </p>
                    </div>
                ))
                :
                ""
            }
        </>
    )
    
}

export default Result;