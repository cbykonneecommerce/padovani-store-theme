import React, { useState } from "react";
import { FormattedPrice } from 'vtex.formatted-price';
import { SliderLayout } from 'vtex.slider-layout';
import { useOrderItems } from 'vtex.order-items/OrderItems';
import { usePixel } from "vtex.pixel-manager";
import { useDevice } from 'vtex.device-detector';

import { ambiencesliderLayoutConfig } from "../config/sliderLayout";

import styles from "../../../../styles/css/landing.page-buy-together.css";

const ModalProduct = ({
    product,
    position
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { addItems } = useOrderItems();
    const { push } = usePixel();
    const { isMobile } = useDevice();

    if (!product || !position) return <></>;

    async function addToCart() {
        const options = {
            allowedOutdatedData: ['paymentData'],
          }

        await addItems([{
            ...options, 
            id: product?.items[0]?.itemId,
            seller: product?.items[0]?.sellers[0]?.sellerId,
            quantity: 1,
            
        }]);
        
        push({ event: "addToCart" });
    };

    function handleModalOpen(open) {
        if (isMobile) {
            setIsOpen(!isOpen)
        } else {
            setIsOpen(open);
        }
    }

    function calculatePositionShelf(position) {
        return {
            ...(position.y > 50 ? { bottom: '100%' } : { top: '100%' }),
            ...(position.x > 50 ? { right: 0 } : { left: 0 }),
        };
    }

    return (
        <section onMouseLeave={() => !isMobile && handleModalOpen(false)} className={`${styles.BuyTogetherModalWrapper} ${isOpen ? styles.BuyTogetherModalOpen : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }}> 
            <div className={styles.BuyTogetherModalContainer} >
                <div
                    onMouseEnter={() => !isMobile && handleModalOpen(true)}
                    onClick={() => isMobile &&  handleModalOpen(isOpen)}
                    className={styles.BuyTogetherModalAction}
                >+</div>

                <div
                    className={styles.BuyTogetherModalShelf}
                    style={calculatePositionShelf(position)}
                >    
        
                    <div className={styles.BuyTogetherModalImage} >
                        <SliderLayout {...ambiencesliderLayoutConfig}>
                            {product?.items[0]?.images?.map(element => (
                                <img loading="lazy" src={element.imageUrl} alt={element.complementName} key={element.complementName} />
                            ))}
                        </SliderLayout>
                    </div>

                    <div className={styles.BuyTogetherModalInfos}> 
                        <h2>{product?.productName}</h2>
                        <span className={styles.BuyTogetherModalInfoText}>Por apenas:</span>
                        <div className={styles.BuyTogetherModalPrices}>
                            <span className={styles.BuyTogetherModalPrice}>
                                <FormattedPrice value={product.items[0].sellers[0].commertialOffer.Price} />
                            </span>
                        </div>
                    </div>

                    <button className={styles.BuyTogetherModalButton} onClick={addToCart}>Por no carrinho</button>

                </div>

            </div>

        </section>
    )
}

export default ModalProduct
