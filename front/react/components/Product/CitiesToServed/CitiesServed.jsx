import React, {useState} from "react"
import styles from "../../../styles/css/product.cities-to-served.css"
import { useProduct, useProductDispatch } from "vtex.product-context"
import Modal from "./Modal/Modal"
import { Checkbox } from 'vtex.styleguide'

const CitiesServed = (props) => {
    const context = useProduct()
    const [isOpen, SetIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const dispatch = useProductDispatch();
    const quantity = context?.selectedQuantity;


    const handleCheckBoxClick = (checkboxIsChecked) => {
        setIsChecked(!isChecked)

        if (checkboxIsChecked) {
            dispatch({
                type: "SET_QUANTITY",
                args: {quantity: quantity + 1}
            })
        } else {
            dispatch({
                type: "SET_QUANTITY",
                args: {quantity: quantity - 1}
            })
        }
    }

    const toggleModal = () => {
        SetIsOpen(!isOpen)
    }
    
    if(context?.product?.categoryId !== "1000637" || props.shippingCompany.length < 1) return <></>

    return (
        <>  
            <div className={styles.CheckboxPorcelanatoContainer}>
                <Checkbox
                    checked={isChecked}
                    partial={true}
                    id="checkbox-porcelanato"
                    name="checkbox-porcelanato"
                    value={isChecked}
                    onChange={() => handleCheckBoxClick(!isChecked)}
                />
                <label for="checkbox-porcelanato">Quero <b>adicionar +10%</b> para perdas na instalação</label>
            </div>


            <div className={styles.CitiesServedContainer}>

                <p>
                    Para pisos, porcelanatos e revestimentos a Padovani segue a
                    seguinte política:<br></br><br></br>

                    - Entrega por transportadora própria dentro de um raio
                    exclusivo de cidades. <u onClick={toggleModal}>Confira as cidades atendidas aqui.</u><br></br>
                    <a
                        href="/institucional/politica-entrega"
                        target="_blank"
                        aria-label="Navegue até a Política de Entrega"
                    >Política de entrega.
                    </a> <br></br><br></br>

                    - Para demais localidades disponibilizamos a venda através
                    de retirada no nosso Centro de Distribuição.<br></br>
                    <a
                        href="/institucional/politica-retirada"
                        target="_blank"
                        aria-label="Navegue até a Política de Retirada"
                    >
                        Política de Retirada.
                    </a>
                </p>
                < Modal isOpen={isOpen} toggleModal={toggleModal} props={props} />
            </div>
        </>

    )
}

CitiesServed.schema = {
    title: "Cidades atendidas",
    type: "object",
    properties: {
        title: {
            title: "titulo",
            type: "string"
        },
        shippingCompany: {
            title: 'Transportadoras',
            type: 'array',
            items: {
                title: "Item",
                type: 'object',
                properties: {
                    title: {
                        title: "Nome da transportadora",
                        type: "string"
                    },
                    cities: {
                        title: 'Cidades',
                        type: 'array',
                        items: {
                            title: "Cidade",
                            type: 'object',
                            properties: {
                                title: {                                     
                                    type: 'string',
                                    title: 'Nome da cidade'
                                }
                            },
                        },
                    },
                },
        
            },
        },
    }
}

export default CitiesServed
