import React from "react"
import { useProduct } from "vtex.product-context"
import styles from "../../styles/css/product.banner-product.css"

const BannerProduct = ({ data }) => {
    const context = useProduct()

    const getPropertyFromLimitador = (limitador) => {
        switch (limitador) {
            case "categoria":
                return context?.product?.categoryId;
            case "marca":
                return context?.product?.brandId;
            case "produto":
                return context?.product?.productId;
            default:
                return null;
        }
    };

    const getCluster = (id) => {
        return context?.product?.productClusters?.find(element => {
            return element.id == id
        }) || context?.product?.clusterHighlights?.find(element => {
            return element.id == id
        })
    }

    if (data?.length < 1 || data == undefined) return <></>

    return (
        <div>
            {data?.map(element => (
                (element?.id == getPropertyFromLimitador(element?.limitador)) &&
                (!element?.idCluster || element?.idCluster === getCluster(element?.idCluster)?.id) && (
                    <img className={styles.BannerProduct} src={element?.image} alt={element?.description} key={element?.id} />
                )
            ))}
        </div>
    )
}

BannerProduct.schema = {
    title: "Banner produto",
    type: "object",
    properties: {
        data: {
            type: "array",
            title: "Tipos de Produto",
            items: {
                properties: {
                    description: {
                        title: "Descrição da imagem",
                        type: "string"
                    },
                    image: {
                        title: "Imagem do banner",
                        type: "string",
                        widget: {
                            'ui:widget': 'image-uploader',
                        }
                    },
                    limitador: {
                        title: "Tipo (obrigatório)",
                        type: "string",
                        enum: [
                            "categoria",
                            "marca",
                            "produto"
                        ],
                        widget: {
                            'ui:widget': 'select',
                        },
                    },
                    id: {
                        title: "Id",
                        type: "string",
                        description: "Id para limitar o bloco somente no produto ou nos produtos com a marca/categoria correta"
                    },
                    idCluster: {
                        title: "id da coleção",
                        type: "string",
                        description: "Limitador para uma coleção"
                    }
                }
            }
        }
    }
}

export default BannerProduct;
