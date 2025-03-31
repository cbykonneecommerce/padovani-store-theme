import React, { createContext, useContext, useState, useEffect } from "react";

export const BuyTogetherContext = createContext({});

export default function BuyTogetherProvider({ children, baseColorCtx }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalPriceProductsSeleted, setTotalPriceProductsSeleted] = useState(0);
    const [selectedBombPosition, setSelectedBombPosition] = useState('');
    const [baseColor, setBaseColor] = useState(baseColorCtx);

    useEffect(() => {
        calculateSum(selectedProducts);
    }, [selectedProducts]);

    function addSugestion(itemId, productPrice, listPrice, sellerId, quantity) {
        const existingProductIndex = selectedProducts.findIndex(
            (product) => product.id === itemId
        );
    
        if (existingProductIndex !== -1) {
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex].quantity = quantity;
    
            setSelectedProducts(updatedProducts);
        } else {
            const newSelectedProduct = {
                id: itemId,
                price: productPrice,
                listPrice: listPrice,
                sellerId: sellerId,
                quantity: quantity,
            };
    
            setSelectedProducts((prevSelectedProducts) => [
                ...prevSelectedProducts,
                newSelectedProduct,
            ]);
        }
    }

    function calculateSum(updatedProducts) {
        const sumTotalPrice = updatedProducts.reduce((total, product) => {
            return total + product.price * product.quantity;
        }, 0);

        const sumTotalListPrice = updatedProducts.reduce((total, product) => {
            return total + product.listPrice * product.quantity;
        }, 0);
    
        setTotalPriceProductsSeleted({
            price: sumTotalPrice,
            listPrice: sumTotalListPrice
        });
    }

    function clearSugestion(id) {
        setSelectedProducts(curr =>
            [...curr.filter((item) => item.id !== id)]
        );
    }

    return (
        <BuyTogetherContext.Provider
            value={{
                selectedProducts,
                totalPriceProductsSeleted,
                selectedBombPosition,
                baseColor,
                setBaseColor,
                setSelectedBombPosition,
                addSugestion,
                clearSugestion,
            }}>
            {children}
        </BuyTogetherContext.Provider>
    )
}

const useBuyTogether = () => {
    const context = useContext(BuyTogetherContext);

    if (context === undefined) throw new Error("useBuyTogether must be used within a BuyTogetherProvider");

    return context;
};

export { BuyTogetherProvider, useBuyTogether };