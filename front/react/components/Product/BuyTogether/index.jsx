import React, { useEffect, useState, useRef } from "react"

import styles from "../../../styles/css/product.buy-together.css"

import BuyTogetherProvider from "./context/BuyTogetherProvider";
import { BuyTogetherService } from "./service/BuyTogetherService";
import { useProduct } from "vtex.product-context";

import ListProducts from "./components/ListProducts";
import ListColors from "./components/ListColors";
import AddToCart from "./components/AddToCart";
import BombSelect from "./components/BombSelect";

const BuyTogether = (props) => {
    const context = useProduct();
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [mainProduct, setMainProduct] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [matchingCollection, setMatchingCollection] = useState(null);
    const [isVisible, setIsVisible] = useState();
    const componentRef = useRef();

    let service = null;
    
    if (context?.product?.productId) {
        service = new BuyTogetherService(context?.product?.productId);
    }
    
    useEffect(() => {
        getProducts();
        getColors();
        verifyProductHasBuyTogether();
    }, [context?.product, props])

    useEffect(() => {
        getMainProduct();
    }, [context?.product?.items])
    
    async function getMainProduct() {
        if (context?.product?.items[0]) {
            setMainProduct({
                id: context?.product?.items[0]?.itemId,
                price: context?.product?.items[0]?.sellers[0]?.commertialOffer?.Price,
                listPrice: context?.product?.items[0]?.sellers[0]?.commertialOffer?.ListPrice,
                seller: context?.product?.items[0]?.sellers[0]?.sellerId,
                quantity: 1
            });
        } else {
            setMainProduct(null);
        }
    }

    async function getProducts() {
        const productListOne = await service.getSuggestions();
        const productListTwo = await service.getAccessories();
        let productArray = []

        productArray.push(productListOne, productListTwo)

        setProducts(productArray);
    }

    async function getColors() {
        const colorsList = await service.getSimilars();
        let colors = [];

        colors.push(colorsList);
        setColors(colors);
    }

    function verifyProductHasBuyTogether() {
        const collectionsProduct = context?.product?.productClusters;
        const collectionsBuyTogether = props?.typesBuyTogether;

        if (collectionsProduct?.length > 0 && collectionsBuyTogether?.length > 0) {

            collectionsProduct?.forEach(productCollection => {

                collectionsBuyTogether?.forEach(buyTogetherCollection => {
                    if (productCollection?.id == buyTogetherCollection?.id) {
                        setIsActive(true);
                        setMatchingCollection(buyTogetherCollection);
                    }
                });
            });
        }
    }

    function checkComponentOnScreen() {
        const valueToShow = window.screenX > 1024 ? 800 : 600;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting && window.scrollY > valueToShow);
            },
            {
            // Opções de observação (nesse caso, observar quando o componente entra e sai da visualização)
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
            }
        );
      
        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }

    useEffect(() => {
        const handleScroll = () => {
            checkComponentOnScreen();
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!products || products?.length === 0 || !isActive || matchingCollection == null || mainProduct == null) return <></>


    return (
        <section ref={componentRef} className={styles.BuyTogetherContainer} >

            {(matchingCollection?.textInfo || matchingCollection?.steps?.length > 0) && (
                <div className={styles.BuyTogetherInfoContainer} >
                    {matchingCollection?.textInfo && (
                        <p className={styles.BuyTogetherInfoText} >
                            {matchingCollection.textInfo}
                        </p>
                    )}
    
                    {matchingCollection?.steps?.length > 0 && (
                        <ul className={styles.BuyTogetherInfoList}>
                            {
                                matchingCollection?.steps?.map((element, index) => (
                                    <li className={styles.BuyTogetherInfoItem}>
                                        
                                        {element?.icon && element?.iconDescription && (
                                            <img
                                                src={element?.icon}
                                                alt={element?.iconDescription}
                                                className={styles.BuyTogetherInfoImage}
                                            />
                                        )}
    
                                        <span className={styles.BuyTogetherInfoStep}>{index + 1}</span>
                                        <span className={styles.BuyTogetherInfoStepText} >{element.title}</span>    
                                    </li>
                                ))
                            }
                        </ul>
                    )
    
                    }
                </div>
            )}

            
            {matchingCollection.banner && matchingCollection.bannerDescription && (
                < img
                    src={matchingCollection.banner}
                    alt={matchingCollection.bannerDescription}
                    className={styles.BuyTogetherBanner}
                />
            )}
            
            <BuyTogetherProvider products={products} baseColorCtx={matchingCollection?.baseColor}>
                {
                    products?.map((element, index) => (
                        <>
                            {index == 0 ? (
                                matchingCollection.firstTitle && element?.length > 0 &&
                                    <h2
                                        style={{
                                            color: `${matchingCollection?.baseColor}`,
                                            borderBottomColor: `${matchingCollection?.baseColor}`
                                        }}
                                        className={styles.TileListProduct}
                                    >
                                        {matchingCollection.firstTitle}
                                    </h2>
                            ) : (
                                matchingCollection.secondTitle && element?.length > 0 &&
                                    <h2
                                        style={{
                                            color: `${matchingCollection?.baseColor}`,
                                            borderBottomColor: `${matchingCollection?.baseColor}`
                                        }}
                                        className={styles.TileListProduct}>
                                        {matchingCollection.secondTitle}
                                    </h2>
                            )}
                            <ListProducts products={element} />
                        </>
                    ))}
                
                    {matchingCollection.thirdListIsActive && (
                        matchingCollection.componentType === "colors" ? (
                            <ListColors colors={colors[0]}  />
                            
                        ) : (
                            <>
                                {matchingCollection.thirdTitle && <h2 className={styles.TileListProduct}>{matchingCollection.thirdTitle}</h2>}
                                <ListProducts products={colors[0]} />
                            </>
                        )
                )} 
                
                {matchingCollection.bombPositionIsActive && (
                    < BombSelect mainProduct={mainProduct} images={context?.product?.items[0]?.images} title={matchingCollection?.title} text={matchingCollection?.text} />
                )}
                <AddToCart mainProduct={mainProduct} />

                {matchingCollection?.buyButtonFixed && (
                    <AddToCart isFixed={matchingCollection?.buyButtonFixed} isVisible={isVisible} mainProduct={mainProduct} />
                )}
                
            </BuyTogetherProvider>
        </section>    
    )
}

BuyTogether.schema = {
    title: "Compre Junto",
    type: "object",
    properties: {
        typesBuyTogether: {
            title: 'Compre Junto',
            type: 'array',
            items: {
                title: "Compre JUnto",
                type: 'object',
                properties: {
                    baseColor: {
                        title: 'Cor base',
                        type: "string",
                        widget: {
                            "ui:widget": "color"
                        },
                        default: '#4fb8d3'
                    },
                    buyButtonFixed: {
                        type: 'boolean',
                        title: 'Botão de comprar flutua em tela',
                        default: false,
                    },
                    __editorItemTitle: {
                        title: 'Nome da Variação',
                        type: 'string',
                        description: 'Ajuda na manutenção no Site Editor'
                    },
                    id: {                                     
                        type: 'number',
                        title: 'ID da coleção',
                    },
                    textInfo: {
                        title: "Texto informativo",
                        type: "string",
                        widget: {
                            'ui:widget': 'textarea',
                        }
                    },
                    steps: {
                        title: 'Passo a passo',
                        type: 'array',
                        items: {
                            title: "Passo",
                            type: 'object',
                            properties: {
                                title: {
                                    title: "Texto informativo",
                                    type: "string",
                                    widget: {
                                        'ui:widget': 'textarea',
                                    }
                                },
                                icon: {
                                    title: 'Ícone',
                                    type: 'string',
                                    widget: {
                                        'ui:widget': 'image-uploader',
                                    },
                                },
                                iconDescription: {
                                    title: "Texto do Ícone",
                                    type: "string",
                                    description: "Descreva a imagem. Ajuda na acessibilidade e SEO",
                                    widget: {
                                        'ui:widget': 'textarea',
                                    }
                                },
                            },
                    
                        },
                    },
                    banner: {
                        title: 'Banner',
                        type: 'string',
                        widget: {
                            'ui:widget': 'image-uploader',
                        },
                    },
                    bannerDescription: {
                        title: "Texto do Banner",
                        type: "string",
                        description: "Descreva a imagem. Ajuda na acessibilidade e SEO",
                        widget: {
                            'ui:widget': 'textarea',
                        }
                    },
                    firstTitle: {
                        title: "Titulo da primeira lista de produtos",
                        type: "string"
                    },
                    secondTitle: {
                        title: "Titulo da segunda lista de produtos",
                        type: "string"
                    },
                    thirdListIsActive: {
                        title: 'Mostrar terceira lista?',
                        type: 'boolean',
                        default: false
                    },
                    bombPositionIsActive: {
                            title: 'Mostrar componente de adicionar bomba?',
                            type: 'boolean',
                            default: false,
                            description: 'Componente que o usuário seleciona posição da bomba em banheiras'
                    },
                },
                required: ['thirdListIsActive', 'bombPositionIsActive'],
                dependencies: {
                    thirdListIsActive: {
                        oneOf: [
                            {
                                properties: {
                                    thirdListIsActive: {
                                        enum: [true]
                                    },
                                    componentType: {
                                        title: 'Tipo de terceira lista',
                                        type: 'string',
                                        enum: [
                                            'colors',
                                            'normal-products'
                                        ],
                                        enumNames: [
                                            'Cores',
                                            'Produtos normais'
                                        ],
                                        default: 'normal-products',
                                        description: 'Mostrar cores, para usuário navegar ou outros produtos para o usuário selecionar e comprar'
                                    },
                                },
                                required: ['componentType'],
                                dependencies: {
                                    componentType: {
                                        oneOf: [
                                            {
                                                properties: {
                                                    componentType: {
                                                        enum: ['normal-products']
                                                    },
                                                    thirdTitle: {
                                                        title: "Titulo da terceira lista de produtos",
                                                        type: "string"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }     
                        ]
                    },
                    bombPositionIsActive: {
                        oneOf: [
                            {
                                properties: {
                                    bombPositionIsActive: {
                                        enum: [true]
                                    },
                                    title: {
                                        title: "Título posição da bomba",
                                        type: "string"
                                    },
                                    text: {
                                        title: "Texto informativo posição da bomba",
                                        type: "string",
                                        widget: {
                                            'ui:widget': 'textarea',
                                        }
                                    },
                                }
                            }     
                        ]
                    }
                }
            },
        }
    },
}

export default BuyTogether