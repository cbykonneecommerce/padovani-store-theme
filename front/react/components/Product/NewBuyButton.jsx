import React from "react";
import { usePixel } from "vtex.pixel-manager";
import { useProduct } from "vtex.product-context";
import { useOrderItems } from "vtex.order-items/OrderItems";
import styles from "../../styles/css/product.css";

const NewBuyButton = (props) => {
  const prodContext = useProduct();
  const { addItems } = useOrderItems();
  const { push } = usePixel();
  const isAvaible =
    prodContext?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity >
    0;

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

    push({ event: "addToCart" });
    addItems(products);
  }

  return (
    <>
      <div>
        <button
          className={`${styles.NewBuyButton}`}
          style={{
            background: `${props.colorBg}`,
            color: `${props.colorkLetter}`,
          }}
          onClick={(event) => {
            event.stopPropagation();
            addToCart(
              prodContext?.selectedItem?.itemId,
              prodContext?.selectedQuantity,
              prodContext?.selectedItem?.sellers[0]?.sellerId
            );
          }}
        >
          {props.textBtn}
        </button>
      </div>
    </>
  );
};

NewBuyButton.schema = {
  title: "Editor Botão de Compra",
  type: "object",
  properties: {
    colorBg: {
      title: "Cor do fundo do botão",
      type: "string",
      default: "#dee7fc",
      description:
        "Você colocará a cor do fundo em Hezadecimal. Exemplo: #FF0000 = Cor vermelha",
    },
    colorkLetter: {
      title: "Cor das letras do botão",
      type: "string",
      default: "#3c5ca7",
      description:
        "Você colocará a cor da letra em Hezadecimal. Exemplo: #FF0000 = Cor vermelha",
    },
    textBtn: {
      title: "Texto do botão",
      type: "string",
      default: "Adicionar ao Carrinho",
      description: "Aqui você colocará o texto desejado",
    },
  },
};

export default NewBuyButton;
