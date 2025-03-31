import { useState, useEffect } from "react";
import { useProduct } from "vtex.product-context";
import styles from "../../styles/css/product.mini-description.css";

const MiniDescription = () => {
  const context = useProduct();
  const [specificationsProd, setSpecificationsProd] = useState([]);

  if (context == null) return null;

  function filtrarTresIndicesAleatorios(array) {
    // Embaralha o array e pega os três primeiros elementos
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, 3);
  }

  const getSpecifications = () => {
    const specifications = context?.product?.specificationGroups?.filter(
      (find) => {
        if (find.name == "allSpecifications") return find;
      }
    );

    if (
      specifications?.length > 0 &&
      specifications[0]?.specifications?.length > 0
    ) {
      const valores = filtrarTresIndicesAleatorios(
        specifications[0]?.specifications
      );
      setSpecificationsProd(valores);
    }
  };

  useEffect(() => {
    getSpecifications();
  }, [context?.product?.specificationGroups]);

  if (specificationsProd == null || specificationsProd?.length < 1) return null;

  return (
    <ul className={styles.MiniDescriptionsList}>
      {specificationsProd.map((element, index) => (
        <li key={index} className={styles.MiniDescriptionsListItem}>
          {element?.name}: {element?.values[0]}
        </li>
      ))}
    </ul>
  );
};

export default MiniDescription;
