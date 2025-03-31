import React, { useEffect, useState } from "react"

import { Checkbox, NumericStepper } from 'vtex.styleguide'
import { FormattedPrice } from 'vtex.formatted-price'
import { SliderLayout } from 'vtex.slider-layout'

import CloseIcon from "../../../../UI/CloseIcon/CloseIcon"

import { sliderLayoutConfig } from "../config/sliderLayout"
import { useBuyTogether } from "../context/BuyTogetherProvider"
import styles from "../../../../styles/css/product.buy-together.css"

const ModalProduct = ({
    product,
    index,
    quantities,
    handleQuantityChangeGlobal,
    handleCheckboxChange,
    checkedStates,
    onAddSugestion,
    handleModalToggle
}) => {
    const [specification, setSpecification] = useState([]);
    const { baseColor } = useBuyTogether();

    if (!product) return <></>;

    function getSpecificationsList() {
        const allSpecificationNames = product.allSpecifications;
        let result = [];

        allSpecificationNames?.forEach(specification => {

            if (product.hasOwnProperty(specification)) {
                result.push({
                    name: specification,
                    value: [product[specification][0]]
                })
            }

        });

        setSpecification(result);
    }

    useEffect(() => {
        getSpecificationsList();
    }, [product])

    return (
        <> 
            <div onClick={() => handleModalToggle(null)} className={styles.BuyTogetherModalOverlay}></div>
            <section className={`${styles.BuyTogetherModalContainer} ${checkedStates[index] ? styles.BuyTogetherModalSelected : ''}`}>    
                
                <CloseIcon handleModalToggle={() => handleModalToggle(null)} />

                <div className={styles.BuyTogetherModalTop}> 
                    <h2>{product?.productName}</h2>
                    <div className={styles.BuyTogetherModalPrices}>
                        <span className={styles.BuyTogetherModalListPrice}>
                            <FormattedPrice value={product.items[0].sellers[0].commertialOffer.ListPrice} />
                        </span>
                        <span style={{color: baseColor}}  className={styles.BuyTogetherModalPrice}>
                            <FormattedPrice value={product.items[0].sellers[0].commertialOffer.Price} />
                        </span>
                    </div>
                </div>

                <div className={styles.BuyTogetherModalMid} >

                    <SliderLayout {...sliderLayoutConfig}>
                        {product?.items[0]?.images?.map(element => (
                            <img src={element.imageUrl} alt={element.complementName} key={element.complementName} />
                        ))}
                    </SliderLayout>
                    
                    <div className={styles.BuyTogetherModalInfoContainer} >
                        {product?.description && (
                            <div className={styles.BuyTogetherModalInfoWrapper}>
                                <h3>Descrição</h3>
                                <p>{product?.description}</p>

                                {specification?.length > 0 && (
                                    <>
                                        <h3>Dados Técnicos</h3>
                                        {specification.map(element => (
                                            <div key={element.name}>
                                                <p><b>{element.name}</b>: {element.value[0]}</p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                </div>

                <div className={styles.BuyTogetherModalBottom} >
                    <NumericStepper
                        minValue={0}
                        value={quantities[index]}
                        onChange={(event) => handleQuantityChangeGlobal(index, event.value)}
                    />

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
                            handleModalToggle(null)
                        } }
                        value={`option-${index}`}
                    />
                </div>

            </section>
        </>
    )
}

export default ModalProduct
