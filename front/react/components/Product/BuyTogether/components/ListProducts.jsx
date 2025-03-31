import React, { useState } from "react"

import { Checkbox, NumericStepper } from 'vtex.styleguide'
import { FormattedPrice } from 'vtex.formatted-price'
import { useDevice } from 'vtex.device-detector';
import { SliderLayout } from 'vtex.slider-layout'

import ModalProduct from "./ModalProduct"

import { sliderLayoutConfig } from "../config/sliderLayout"
import { useBuyTogether } from "../context/BuyTogetherProvider"
import styles from "../../../../styles/css/product.buy-together.css"

const ListProducts = ({products}) => {
    const { isMobile } = useDevice();
    const {addSugestion, clearSugestion, baseColor } = useBuyTogether();
    const [checkedStates, setCheckedStates] = useState(Array(products.length).fill(false));
    const [quantities, setQuantities] = useState(Array(products.length).fill(0));
    const [openModal, setIsOpen] = useState(false);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    function handleModalToggle(index) {
        setIsOpen(!openModal);
        setSelectedProductIndex(index);
    }
    
    function handleCheckboxChange(index) {
        const newCheckedStates = [...checkedStates];
        newCheckedStates[index] = !newCheckedStates[index];
        setCheckedStates(newCheckedStates);

        if (newCheckedStates[index]) {
                handleQuantityChangeLocal(index, 1);
        }
        else {
            handleQuantityChangeGlobal(index, 0);
        }
    };

    function onAddSugestion(isChecked, index, quantity) {
        isChecked
            ? addSugestion(
                products[index]?.items[0]?.itemId,
                Number(products[index]?.items[0]?.sellers[0]?.commertialOffer?.Price),
                Number(products[index]?.items[0]?.sellers[0]?.commertialOffer?.ListPrice),
                Number(products[index]?.items[0]?.sellers[0]?.sellerId),
                quantity
            )
            : clearSugestion(products[index]?.items[0]?.itemId);
    };
    
    function handleQuantityChangeLocal(index, quantity) {
        const newQuantities = [...quantities];
        newQuantities[index] = quantity;
        setQuantities(newQuantities);
    };

    function handleQuantityChangeGlobal(index, quantity) {
        handleQuantityChangeLocal(index, quantity)

        const newCheckedStates = [...checkedStates];

        if (quantity > 0) {
            newCheckedStates[index] = true;
            onAddSugestion(true, index, quantity)
        } else {
            newCheckedStates[index] = false;
            onAddSugestion(false, index, quantity)
        }

        setCheckedStates(newCheckedStates);
    };

    if (products?.length < 1) return <></> 

    return (
        <section className={styles.ProductListContainer}>
            <ul className={styles.ProductListWrapper}>
                {isMobile ? (
                    <SliderLayout {...sliderLayoutConfig}>
                        {products?.map((element, index) => (
                                <li>
                                    <div className={`${styles.ProductListItem} ${checkedStates[index] ? styles.SelectedProduct : ''}`} key={index}>
                                        <div className={styles.ProductListItemTop}>
                                            <Checkbox
                                                checked={checkedStates[index]}
                                                partial={true}
                                                id={index}
                                                label={checkedStates[index] ? "Adicionado" : "Adicionar"}
                                                name="default-checkbox-group"
                                                onChange={(e) => {
                                                    handleCheckboxChange(index)
                                                    onAddSugestion(
                                                        e.target.checked,
                                                        index,
                                                        1
                                                    )
                                                } }
                                                value={`option-${index}`} />
                                            <span onClick={() => handleModalToggle(index)}>+ Detalhes</span>
                                        </div>
        
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
                                                    <NumericStepper
                                                        minValue={0}
                                                        value={quantities[index]}
                                                        onChange={(event) => handleQuantityChangeGlobal(index, event.value)} />
                                                </div>
                                            </div>
        
                                        </div>
        
                                    </div>
                                </li>
                        ))}
                    </SliderLayout>
                ): 
                (
                    products?.map((element, index) => (
                        <li>
                            <div className={`${styles.ProductListItem} ${checkedStates[index] ? styles.SelectedProduct : ''}`} key={index}>
                                <div className={styles.ProductListItemTop}>
                                    <Checkbox
                                        checked={checkedStates[index]}
                                        partial={true}
                                        id={index}
                                        label={checkedStates[index] ? "Adicionado" : "Adicionar"}
                                        name="default-checkbox-group"
                                        onChange={(e) => {
                                            handleCheckboxChange(index)
                                            onAddSugestion(
                                                e.target.checked,
                                                index,
                                                1
                                            )
                                        } }
                                        value={`option-${index}`} />
                                    <span onClick={() => handleModalToggle(index)}>+ Detalhes</span>
                                </div>
    
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
                                            <NumericStepper
                                                minValue={0}
                                                value={quantities[index]}
                                                onChange={(event) => handleQuantityChangeGlobal(index, event.value)} />
                                        </div>
                                    </div>
    
                                </div>
    
                            </div>
                        </li>  
                    ))    
                )
                }

            </ul>
            {
                selectedProductIndex !== null && (
                    <ModalProduct
                        quantities={quantities}
                        handleQuantityChangeGlobal={handleQuantityChangeGlobal}
                        handleCheckboxChange={handleCheckboxChange}
                        handleModalToggle={handleModalToggle}
                        checkedStates={checkedStates}
                        onAddSugestion={onAddSugestion}
                        product={products[selectedProductIndex]}
                        index={selectedProductIndex}
                    />
                )
            }
        </section>
    )
}

export default ListProducts