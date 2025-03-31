import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";

import styles from "../../styles/css/product.highlights.css";

const ProductFlag = ({isProduct }) => {
  const productClusters = useProduct()?.product?.productClusters;

  const flagClusters = productClusters?.filter((cluster) => {
    return cluster.name.split(" ").some((word) => word === "FLAG");
  });

  const [clusterFlags, setClusterFlags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = flagClusters?.map(async (flag) => {
          const response = await fetch(
            `https://padovani.vteximg.com.br/arquivos/flag-cluster-${flag?.id}.png`
          );

          if (response.ok) {
            setClusterFlags((oldValue) => [
              `https://padovani.vteximg.com.br/arquivos/flag-cluster-${flag?.id}.png`,
              ...oldValue,
            ]);
          } else {
            return
          }
        });

        await Promise.all(requests || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`${!isProduct ? styles["FlagsContainer"] : styles["FlagsContainerPDP"]}`}>
      {clusterFlags.length > 0
        ? clusterFlags.map((item, idx) => (
          <div key={idx} className={styles["ProductFlag"]}>
            <img
              className={styles["ProductFlag__image"]}
              src={item}
              alt="Flag"
              loading="lazy"
            />
          </div>
        ))
        : null}
    </div>
  );
};

export { ProductFlag };