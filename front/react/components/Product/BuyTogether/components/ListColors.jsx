import React from "react"

import { FormattedPrice } from 'vtex.formatted-price'
import { useDevice } from 'vtex.device-detector';
import { SliderLayout } from 'vtex.slider-layout'
import { useBuyTogether } from "../context/BuyTogetherProvider"

import { sliderLayoutConfig } from "../config/sliderLayout"
import styles from "../../../../styles/css/product.buy-together.css"

const ListColors = ({ colors, thirdTitle }) => {
    const {baseColor } = useBuyTogether();
    const { isMobile } = useDevice();

    if (colors?.length < 1) return <></> 

    return (
        <section className={styles.ProductListContainer}>
            <h2 className={styles.ProductListColorTitle}>{thirdTitle !== undefined ? thirdTitle : "Cores Disponiveis"}</h2>
            <ul className={styles.ProductListWrapper}>
                {isMobile ? (
                    <SliderLayout {...sliderLayoutConfig}>
                        {colors?.map((element, index) => (
                            <li>
                                <a href={element.link} aria-label={`navegue para o elemento ${element.productName}`}>
                                    <div className={styles.ProductListItem}  key={index}>
                                        <div className={styles.ProductListItemBottom}>
                                            <img src={element.items[0].images[0].imageUrl} alt={element.items[0].images[0].complementName} />
        
                                            <div className={styles.ProductListItemInfoWrapper}>
                                                <p>{element?.productName}</p>
        
                                                <div className={styles.ProductListItemInfoAction}>
                                                    <div className={styles.ProductListItemPrices}>
                                                        <span className={styles.ProductListItemListPrice}>
                                                            <FormattedPrice value={element.items[0].sellers[0].commertialOffer.ListPrice} />
                                                        </span>
                                                        <span style={{color: baseColor}} className={styles.ProductListItemPrice}>
                                                            <FormattedPrice value={element.items[0].sellers[0].commertialOffer.Price} />
                                                        </span>
                                                    </div>
                                                    <a>
                                                        Ver Detalhes
                                                    </a>
                                                </div>
                                            </div>
        
                                        </div>
                                    </div>
                                </a> 
                            </li>
                        ))}
                    </SliderLayout>
                ): 
                (
                    colors?.map((element, index) => (
                        <li>
                            <a href={element.link} aria-label={`navegue para o elemento ${element.productName}`}>
                                <div className={styles.ProductListItem}  key={index}>
                                    <div className={styles.ProductListItemBottom}>
                                        <img src={element.items[0].images[0].imageUrl} alt={element.items[0].images[0].complementName} />

                                        <div className={styles.ProductListItemInfoWrapper}>
                                            <p>{element?.productName}</p>

                                            <div className={styles.ProductListItemInfoAction}>
                                                <div className={styles.ProductListItemPrices}>
                                                    <span className={styles.ProductListItemListPrice}>
                                                        <FormattedPrice value={element.items[0].sellers[0].commertialOffer.ListPrice} />
                                                    </span>
                                                    <span style={{color: baseColor}} className={styles.ProductListItemPrice}>
                                                        <FormattedPrice value={element.items[0].sellers[0].commertialOffer.Price} />
                                                    </span>
                                                </div>
                                                <a>
                                                    Ver Detalhes
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </a> 
                        </li>  
                    ))    
                )
                }

            </ul>
        </section>
    )
}

export default ListColors