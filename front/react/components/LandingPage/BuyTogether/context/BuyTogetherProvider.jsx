import React, { createContext, useContext, useState, useEffect } from "react";

export const BuyTogetherContext = createContext({});

export default function BuyTogetherProvider({ children, products }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalPriceProductsSeleted, setTotalPriceProductsSeleted] = useState(0);

    useEffect(() => {
        calculateSum(selectedProducts);
    }, [selectedProducts]);

    useEffect(() => {
        generateInitialStates();
    }, [products]);

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

    function generateInitialStates() {
        if (products && products.length > 0) {
            const initialSelectedProducts = products.map(product => {
                if (product?.productId !== undefined) {
                    return {
                        id: product?.items[0]?.itemId,
                        price: Number(product?.items[0]?.sellers[0]?.commertialOffer?.Price),
                        listPrice: Number(product?.items[0]?.sellers[0]?.commertialOffer?.ListPrice),
                        sellerId: Number(product?.items[0]?.sellers[0]?.sellerId),
                        quantity: 1,
                    };
                }
                return null;
            }).filter(Boolean);
            setSelectedProducts(initialSelectedProducts);
        }
    }

    function addSugestion(idProduct, productPrice, listPrice, sellerId) {
        const existingProductIndex = selectedProducts.findIndex(
            (product) => product.id === idProduct
        );
        
        if (existingProductIndex !== -1) {
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex].quantity = 0;
    
            setSelectedProducts(updatedProducts);
        } else {
            const newSelectedProduct = {
                id: idProduct,
                price: productPrice,
                listPrice: listPrice,
                sellerId: sellerId,
                quantity: 1,
            };
    
            setSelectedProducts((prevSelectedProducts) => [
                ...prevSelectedProducts,
                newSelectedProduct,
            ]);
        }
    }

    function clearSugestion(id) {
        setSelectedProducts(curr =>
            [...curr.filter((item) => item.id !== id)]
        );
    }

    function onAddSugestion(isChecked, index) {
        isChecked
            ? addSugestion(
                products[index]?.items[0]?.itemId,
                Number(products[index]?.items[0]?.sellers[0]?.commertialOffer?.Price),
                Number(products[index]?.items[0]?.sellers[0]?.commertialOffer?.ListPrice),
                Number(products[index]?.items[0]?.sellers[0]?.sellerId),
            )
            : clearSugestion(products[index]?.items[0]?.itemId);
    }

    return (
        <BuyTogetherContext.Provider
            value={{
                totalPriceProductsSeleted,
                selectedProducts,
                onAddSugestion
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