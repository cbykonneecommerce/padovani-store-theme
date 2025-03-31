import React, { useEffect, useState, useRef } from "react"
import styles from "../../../styles/css/product.images.css"
import { useRuntime } from 'vtex.render-runtime'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Image = ({image, buttonZoom, isZoom}) => {

    const { runtime, hints } = useRuntime()

    const [currentZoom, setCurrentZoom] =  useState(null)
    const [isPanningDisabled, setIsPanningDisabled] = useState(true);
    
    const imageZoom = useRef(null);

    const zoom = (id, zoomIn) => {
        zoomIn()
        setCurrentZoom(id)
    }

    const close = (resetTransform) => {
        resetTransform()
        setCurrentZoom(null)
    }

    function handlePanning(e) {
        if (e.scale === 1 && e.positionX === 0 && e.positionY === 0) {
          setIsPanningDisabled(true);
        } else {
          setIsPanningDisabled(false);
        }
    }

    return(
            <>
                { 
                    buttonZoom ?
                        currentZoom == image.imageId ?
                            <button className={styles.reset} onClick={() => close(resetTransform)}>x</button>
                        :
                            <button className={styles.zoom} onClick={() => zoom(image.imageId, zoomIn)}>+</button>
                    : null
                }
                {
                    hints.mobile ?
                        <TransformWrapper centerZoomedOut centerOnInit disablePadding maxScale={3} onZoomStart={function noRefCheck(){ console.log("zoom", imageZoom.current); imageZoom.current.setAttribute("src", `/arquivos/ids/${image.imageId}-1400-2000`) }}>
                            <TransformComponent >
                                {
                                    <picture>
                                        <img ref={imageZoom} className={styles.productImage} src={`/arquivos/ids/${image.imageId}-600-870/`} alt={image?.imageText} />
                                    </picture>
                                }
                            </TransformComponent>
                        </TransformWrapper>
                    :
                        isZoom ?
                            <img className={styles.productImage} src={`/arquivos/ids/${image.imageId}`} alt={image?.imageText} />
                        :
                            <picture>
                                <img className={styles.productImage} src={ isZoom ? `/arquivos/ids/${image.imageId}` : image.imageUrl} alt={image?.imageText} />
                            </picture>
                }
            </>
    )
}

export default Image