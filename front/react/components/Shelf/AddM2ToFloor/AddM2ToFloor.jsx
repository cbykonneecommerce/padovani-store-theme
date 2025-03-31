import React from "react";
import { useProduct } from "vtex.product-context";
import styles from "../../../styles/css/shelf.addM2ToPrice.css";

function AddM2ToFloor() {
  const context = useProduct();
  const productMeasurementUnit = context?.selectedItem?.measurementUnit;
  const availability = context?.selectedItem?.sellers[0]?.commertialOffer?.AvailableQuantity > 0

  const addM2ToPrice = () => {
    if (productMeasurementUnit !== "un" && availability) {
      return `/ ${productMeasurementUnit}`;
    } else {
      return null;
    }
  };

  return (
    <>{addM2ToPrice() && <div className={styles.m2}>{addM2ToPrice()}</div>}</>
  );
}

export default AddM2ToFloor;
