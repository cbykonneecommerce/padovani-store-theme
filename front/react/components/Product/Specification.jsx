import { useState, useEffect } from "react";
import styles from "../../styles/css/product.css";
import { useProduct } from "vtex.product-context";

const Specifications = () => {
  const context = useProduct();
  const [image, setImage] = useState(null);
  const [specifications, setSpecifications] = useState(null);
  const name = context?.selectedItem?.nameComplete;

  if (context == null) return null;

  const getImage = () => {
    const findImage = context?.selectedItem?.images?.filter((find) => {
      if (find.imageLabel == "tecnico") return find;
    });

    if (findImage?.length > 0) setImage(findImage);
  };

  const getSpecifications = () => {
    const specifications = context?.product?.specificationGroups?.filter(
      (find) => {
        if (find.name == "allSpecifications") return find;
      }
    );

    if (specifications?.length > 0) {
      let specificationsArray = [];
      specifications[0]?.specifications?.map((element) => {
        specificationsArray.push(element);
      });

      setSpecifications(specificationsArray);
    }
  };

  useEffect(() => {
    getImage();
    getSpecifications();
  }, [context]);

  if (specifications == null || specifications?.length < 1) return null;

  return (
    <div className={styles.descriptions}>
      <h2 className={styles.descriptionTitle}>Especificações</h2>
      <div className={styles.descriptionContent}>
        <table>
          <tbody>
            {specifications.map((element) => (
              <tr key={element.name}>
                <th>{element.name}</th>
                <td>{element.values[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {image && (
          <div className={styles.imageDescriptions}>
            <img src={image[0].imageUrl} alt={name} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Specifications;
