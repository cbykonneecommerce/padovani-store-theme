import React, { useEffect, useState, useRef, useLayoutEffect } from "react"

import useProduct from "vtex.product-context/useProduct"
import { useRuntime } from 'vtex.render-runtime'

import Image from "./Image"
import styles from "../../../styles/css/product.images.css"
import Skeleton from "../../../UI/Skeleton"

const ProductImages = () => {
    const { hints } = useRuntime()
    const context = useProduct()
    const sliderRef = useRef(null)

    const [ current, setCurrent ] =  useState(null)
    const [ images, setImages ] =  useState(null)
    const [activeImage, setActiveImage] = useState(null)
    const [open, setOpen] = useState(null)
    const [ navigate, setNavigate ] =  useState([])

    if(context) {

        if(context?.selectedItem?.images?.length > 0 && context.selectedItem != current) {

            setImages(context.selectedItem.images)
            setCurrent(context.selectedItem)

            let navImages = []
            
            context.selectedItem.images.map(image => {
                navImages.push(image.imageId)
            })

            setNavigate(navImages)
        }
    }
    

    useLayoutEffect(() => {

        if (!document.querySelector("head link#slick")) {
			document.querySelector("head").insertAdjacentHTML("beforeend", "<link id='slick' rel='stylesheet' type='text/css' charset='UTF-8' href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css' />")
		}

		if (!document.querySelector("head style#slick")) {
			document.querySelector("head").insertAdjacentHTML("beforeend", "<style id='slick'>.slick-slider { width: 100%; } .slider-container {max-width: 100vw;width: 100%;overflow: hidden;} .slick-slider .slick-list { width: 100% }</style>")
		}
    })
    
    useEffect(() => {
        sliderRef?.current?.slickGoTo(0)

        if (images) {
            setActiveImage(images[0]);
        }
    }, [context])

    useEffect(() => {
        let header = document.querySelector(".vtex-sticky-layout-0-x-wrapper--sticky-header")
        let getMainObject = document.querySelector('.vtex-flex-layout-0-x-flexRowContent--product-main .vtex-flex-layout-0-x-stretchChildrenWidth')
        let right = document.querySelector('.vtex-flex-layout-0-x-flexRowContent--product-main > .vtex-flex-layout-0-x-stretchChildrenWidth:last-child')
        
        if(header && getMainObject && right) {
            if(open) {
                getMainObject.style.position = "relative"
                header.style.visibility = "hidden"
                right.style.visibility = "hidden"
            }
            else
            {
                getMainObject.style.position = "sticky"
                header.style.visibility = "visible"
                right.style.visibility = "visible"
            }
        }
    }, [open])

    const Prev = () => {
        let index = navigate.indexOf(open.imageId) - 1
        let calcIndex = index < 0 ? navigate.length - 1 : index
        setOpen(images[calcIndex])
    }

    const Next = () => {
        let index = navigate.indexOf(open.imageId) + 1
        let calcIndex = index == navigate.length ? 0 : index
        setOpen(images[calcIndex])
    }

    if(images == null && hints != null || activeImage == null) return <Skeleton height={440} ></Skeleton>

    return (
        <div className={styles.imagesDetail} dataQuantity={images.length}>
            {
                open &&
                    <div className={styles.wrapperZoom}>
                        <div className={styles.thumbs}>
                            { 
                                images.map((image, index) => {
                                    return(
                                        <div key={index} className={`${styles.image} ${open?.imageId == image.imageId && styles.active }`} onClick={() => { setOpen(image) }}>
                                            <Image image={image} buttonZoom={false} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.containerImageZoomOpen}>
                            <button className={styles.close} onClick={() => { setOpen(null) }}>
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 18L18 30" stroke="#1E1D1D" stroke-linecap="square" stroke-linejoin="round"/><path d="M18 18L30 30" stroke="#1E1D1D" stroke-linecap="square" stroke-linejoin="round"/></svg>
                            </button>
                            <button className={styles.arrowLeft} onClick={() => { Prev() }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.9859 20L8 12L15.9859 4" stroke="#1E1D1D" stroke-miterlimit="10"/></svg>
                            </button>
                            <button className={styles.arrowRight} onClick={() => { Next() }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.01414 4L16 12L8.01414 20" stroke="#1E1D1D" stroke-miterlimit="10"/></svg>
                            </button>
                            <div className={styles.bullets}>
                                { 
                                    images.map((image, index) => {
                                        return(
                                            <div key={index} className={`${styles.bullet} ${open?.imageId == image.imageId && styles.active }`} onClick={() => { setOpen(image) }}></div>
                                        )
                                    })
                                }
                            </div>
                            <div className={styles.principalImage}>
                                <Image image={open} isZoom={true} />
                            </div>
                        </div>
                    </div>
            }

            {
                activeImage &&
                <div className={styles.wrapperImage}>
                    <div className={styles.thumbs}>
                        {
                            images.map((image, index) => {
                                return (
                                    <div key={index} className={`${styles.image} ${activeImage?.imageId == image.imageId && styles.active}`} onClick={() => { setActiveImage(image) }}>
                                        <img draggable={false} src={`/arquivos/ids/${image.imageId}`} alt={image?.imageText} />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={styles.wrapperImageActive}>
                        <div className={styles.bullets}>
                            <p>Imagens Ilustrativas. Em alguns casos nossas imagens estão ambientadas ou com acessórios para melhor a visualização do produto, o que não indica que o produto acompanha aquele acessório.</p>
                        </div>
                        <div className={styles.ImageSliderPdpContainer} onClick={() => setOpen(activeImage)}>
                            <Image image={activeImage} />
                        </div>
                    
                    </div>
                </div>
            }
        
        </div>
    )
}

export default ProductImages