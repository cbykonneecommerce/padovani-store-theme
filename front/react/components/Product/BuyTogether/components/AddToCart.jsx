import React, { memo, useMemo, useState } from "react";

import { usePixel } from "vtex.pixel-manager";
import { FormattedPrice } from "vtex.formatted-price";
import { useOrderItems } from "vtex.order-items/OrderItems";

import { useBuyTogether } from "../context/BuyTogetherProvider";
import Loading from "../../../../UI/Loading/Loading";
import styles from "../../../../styles/css/product.buy-together.css";

function AddToCart({ isFixed, isVisible, mainProduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = usePixel();
  const { addItems } = useOrderItems();

  const {
    selectedProducts: selectedSuggestions,
    totalPriceProductsSeleted,
    selectedBombPosition,
  } = useBuyTogether();

  const totalPrice = useMemo(
    () =>
      parseFloat(totalPriceProductsSeleted?.price) +
      parseFloat(mainProduct?.price),
    [totalPriceProductsSeleted?.price, mainProduct?.price]
  );
  const totalListPrice = useMemo(
    () =>
      parseFloat(totalPriceProductsSeleted?.listPrice) +
      parseFloat(mainProduct?.listPrice),
    [totalPriceProductsSeleted?.listPrice, mainProduct?.listPrice]
  );

  async function handleAddToCart() {
    if (!selectedSuggestions?.length) {
      return;
    }
    setIsLoading(true);

    const suggestionsToCart = selectedSuggestions.map((suggestion) => {
      return {
        id: Number(suggestion.id),
        seller: Number(suggestion.sellerId),
        quantity: Number(suggestion.quantity),
      };
    });

    const items = suggestionsToCart;
    suggestionsToCart.push(mainProduct);

    const options = {
      allowedOutdatedData: ["paymentData"],
    };

    await addItems(items, {
      ...options,
    });
    push({ event: "addToCart" });

    setIsLoading(false);

    if (selectedBombPosition !== "") {
      const index = findIndexProductInOrderForm(mainProduct?.id);
      addAttachmentToProduct(index, selectedBombPosition);
    }
  }

  function getOrderForm() {
    const stringOrderform = window.localStorage.getItem("orderform");
    if (!stringOrderform) return;
    const orderFormStorage = JSON.parse(stringOrderform);

    return orderFormStorage;
  }

  function findIndexProductInOrderForm(productId) {
    const orderForm = getOrderForm();
    let foundIndex = -1;

    orderForm?.items?.forEach((item, index) => {
      if (item.id == productId) {
        foundIndex = index;
      }
    });

    return foundIndex;
  }

  async function addAttachmentToProduct(index, selectedBombPosition) {
    const orderForm = getOrderForm();
    const optionsField = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: {
          "Bomba com 2 Posições": selectedBombPosition,
        },
        expectedOrderFormSections: [
          "items",
          "totalizers",
          "clientProfileData",
          "shippingData",
          "paymentData",
          "sellers",
          "messages",
          "marketingData",
          "clientPreferencesData",
          "storePreferencesData",
          "giftRegistryData",
          "ratesAndBenefitsData",
          "openTextField",
          "commercialConditionData",
          "customData",
        ],
        noSplitItem: true,
      }),
    };
    try {
      const response = await fetch(
        `/api/checkout/pub/orderForm/${orderForm.id}/items/${index}/attachments/Bomba%20com%202%20Posi%C3%A7%C3%B5es`,
        optionsField
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <div
      className={`${styles.BuyAreaContainer} ${isFixed && styles.isFixed} ${
        isVisible && isFixed && styles.isVisible
      }`}
    >
      <p className={styles.BuyAreaText}>Todos os itens selecionados por</p>

      <div className={styles.BuyAreaActionsContainer}>
        {totalPrice > 0 && (
          <p className={styles.BuyAreaPriceContainer}>
            <span className={styles.productPriceCode}>
              <FormattedPrice value={totalListPrice} />
            </span>
            <span className={styles.BuyAreaPrice}>
              <FormattedPrice value={totalPrice} />
            </span>
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedSuggestions?.length}
          title={
            !selectedSuggestions?.length ? "Selecione produtos para comprar" : 0
          }
          className={styles.BuyAreaAddToCart}
        >
          {isLoading ? <Loading /> : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}

export default memo(AddToCart);
