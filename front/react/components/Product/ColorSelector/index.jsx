import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import styles from "../../../styles/css/product.color-selector.css";

const ColorSelector = () => {
    const context = useProduct();
    const [infoSelector, setInfoSelector] = useState(null);
    const [currentColor, setCurrentColor] = useState(null);

    async function getSimilars() {
        const response = await fetch(`/api/catalog_system/pub/products/crossselling/similars/${context?.product?.productId}`);
        const data = await response.json();
        setSimilars(data);
    }

    function setSimilars(response) {
        const updatedInfoSelector = response.map(mapResponseElementSimilar);
        setInfoSelector(updatedInfoSelector);
    }

    function mapResponseElementSimilar(element) {
        const colorName = getColorNameSimilar(element);
        const acronym = colorName.toLowerCase().replace(" ", "-");
    
        return {
            color: colorName,
            url: element.link,
            acronym: acronym
        };
    }
    
    function getColorNameSimilar(element) {
        let colorName = element['Acabamento/Cor'][0];
    
        return colorName;
    }

    function getCurrentProductColor() {
        const color = context?.product?.properties?.find(element => {
            return element.name == "Acabamento/Cor";
        })
        const acronym = color?.values[0]?.toLowerCase().replace(" ", "-");

        setCurrentColor({
            color: color?.values[0],
            acronym: acronym
        });
    }
    
    useEffect(() => {
        getSimilars();
        getCurrentProductColor();
    }, [context?.product?.productId]);

    if (infoSelector === null || infoSelector.length <= 0 || !currentColor) return <></>;

    return (
        <section className={styles.ColorSelectorContainer}>
            <h2 className={styles.ColorSelectorTitle}>Cor:
                <span>{currentColor?.color}</span>
            </h2>
            <ul className={styles.ColorSelectorWrapper}>
                <li className={`${styles.ColorSelectorItem} ${currentColor ? styles.active : ''}`} key={currentColor?.color} title={currentColor?.color}>
                    <img
                        className={styles.ItemColor}
                        src={`https://padovani.vteximg.com.br/arquivos/${currentColor?.acronym}.png`}
                        alt={`Imagem da variação desse produto na cor ${currentColor?.color}`}
                        onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                    />
                </li>
                {infoSelector.map((element, index) => {
                    return (
                        <li className={styles.ColorSelectorItem} key={index} title={element.color}>
                            <a href={element.url} aria-label={`navegue até a cor ${element.color}`}>
                                <img
                                    className={styles.ItemColor}
                                    src={`https://padovani.vteximg.com.br/arquivos/${element.acronym}.png`}
                                    alt={`Imagem da variação desse produto na cor ${element.color}`}
                                    onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default ColorSelector;
