import React, { useState, useRef, useLayoutEffect,} from "react";

import styles from "../../../styles/css/product.images.css"

import { useProduct } from "vtex.product-context";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ProductImageMobile = ({image}) => {
  // const [video, setVideo] = useState(null);

  const imageZoom = useRef(null);

  const [isPanningDisabled, setIsPanningDisabled] = useState(true);

  // const productContextValue = useProduct();
  // const image = productContextValue.selectedItem.images;

  // const [itemsImageList, setItemsImageList] = useState([]);

  function handlePanning(e) {
    if (e.scale === 1 && e.positionX === 0 && e.positionY === 0) {
      setIsPanningDisabled(true);
    } else {
      setIsPanningDisabled(false);
    }
  }


  // useLayoutEffect(() => {
  
  //   setItemsImageList(image);

  //   const getVideo = productContextValue.product.properties.filter((item) => {
  //     if (item.name === "video") return item;
  //   });
  //   if (getVideo.length > 0) setVideo(getVideo[0].values[0]);
  // }, [productContextValue]);

  

  return (
                <TransformWrapper
                  // onZoomStart={(e) => { handlePanning(e.state); imageZoom.current.setAttribute("src", `/arquivos/ids/${image.imageId}-1400-2000`) }}
                  // onZoomStop={(e) => handlePanning(e.state)}
                  // onPanningStart={(e) => handlePanning(e.state)}
                  // panning={{ disabled: isPanningDisabled }}
                  // wheel={{ disabled: true }}
                  // doubleClick={{ mode: "reset"}}
                >
                    <img  className={styles.wrapperZoomMobile} src={image.imageUrl} /> 
                </TransformWrapper>
  );
};

export default ProductImageMobile;
