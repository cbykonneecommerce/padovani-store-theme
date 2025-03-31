import { useState, useEffect } from "react";
import styles from "../../styles/css/product.css";
import { useProduct } from "vtex.product-context";

const Descriptions = () => {
  const context = useProduct();
  const [image, setImage] = useState(null);

  if (context == null) return null;

  const name = context?.selectedItem?.nameComplete;
  const description = context?.product?.description;

  const getImage = () => {
    const findImage = context?.selectedItem?.images.filter((find) => {
      if (find.imageLabel == "ambiente") return find;
    });

    if (findImage?.length > 0) setImage(findImage);
  };

  useEffect(() => {
    getImage();
  }, [context]);

  if (description == null || description == undefined) return null;

  return (
    <div id="product-description" className={styles.descriptions}>
      <h2 className={styles.descriptionTitle}>Descrição</h2>
      <div className={styles.descriptionContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: description.replaceAll(/[\r]/g, "<br>"),
          }}
        />
        {image && (
          <div className={styles.imageDescriptions}>
            <img src={image[0].imageUrl} alt={name} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Descriptions;
