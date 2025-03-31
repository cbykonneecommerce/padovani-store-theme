import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { useOrderItems } from "vtex.order-items/OrderItems";
import { usePixel } from "vtex.pixel-manager";
import styles from "../../../styles/css/shelf.buybutton.css";

const BuyButton = () => {
  const product = useProduct();
  const [selectSku, setSelectSku] = useState();
  const { push } = usePixel();
  const { addItems } = useOrderItems();
  const isAvaible =
    product?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity > 0;

  function addToCart(sku, quantity, seller) {
    if (!isAvaible) return;

    const products = [
      {
        id: sku,
        index: 0,
        quantity: quantity,
        seller: seller,
        options: [],
      },
    ];

    addItems(products);
    push({ event: "addToCart" });
  }

  useEffect(() => {
    const item = product.product.items.reduce((a, b) => {
      if (
        b.sellers[0].commertialOffer.Price < a.sellers[0].commertialOffer.Price
      )
        a = b;
      return a;
    });
    setSelectSku(item);
  }, [product]);

  return (
    <>
      {!isAvaible && (
        <a
          className={styles.customAddToCart}
          href={`javascript:void(0)`}
          style={{ height: !isAvaible && "36px" }}
          onClick={(event) => {
            event.stopPropagation();
            addToCart(selectSku.itemId, 1, selectSku?.sellers[0]?.sellerId);
          }}
        >
          {isAvaible ? "" : "Indisponivel"}
        </a>
      )}
    </>
  );
};
export default BuyButton;
