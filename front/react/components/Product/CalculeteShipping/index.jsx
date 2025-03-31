import React, { useState } from "react";
import { useProduct } from "vtex.product-context";
import Result from "./Result";
import styles from "../../../styles/css/product.calculate-shipping.css"


const CalculateShipping = (props) => {
    const context = useProduct();
    const [cep, setCep] = useState();
    const [error, setError] = useState("");
    const [infoShipping, setInfoShipping] = useState([]);

    const onChange = (ev) => {
        setCep(ev.target.value || "");
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();
        if (!cep)  {
            setError("Por favor preencha o campo de CEP")
            return;
        }

        const options = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "items": [
                    {
                        "id": context?.selectedItem?.itemId,
                        "quantity": "1",
                        "seller": "1"
                    }
                ],
                "country": "BRA",
                "postalCode": cep
            })
        };

        await fetch('/api/checkout/pub/orderForms/simulation/?sc=1', options)
            .then(response => response.json())
            .then(response => {
                
                if (response.logisticsInfo[0].slas.length > 0) {
                    setInfoShipping(response.logisticsInfo[0].slas)
                    
                } else {
                    setError("Não existem fretes disponíveis para o CEP informado")
                }
            })
    };

    return (
        <div className={styles.wrapCalculateShipping}>
            <form className={styles.calculateForm} onSubmit={onSubmit}>
                <div className={styles.wrapCalculateForm}>
                    <input 
                        className="c-on-base t-body pl5"
                        value={cep}
                        type="text" 
                        name="inputCep" 
                        id="inputCep"
                        placeholder="00000-000"
                        onChange={onChange}
                    />

                    <a
                        href="https://www.correios.com.br/busca-cep"
                        target="_blank"
                        className="pointer c-link hover-c-link active-c-link no-underline underline-hover t-small"
                        rel="noreferrer"
                    >
                        Não sei meu CEP
                    </a>
                </div>

                <button 
                    className={styles.calculateShippingBtn} 
                    style={{background: `${props.colorBg}`, color: `${props.colorkLetter}`}} 
                    type="submit"
                >
                    {
                        props.textBtn
                    }
                </button>                
            </form>
            <div className={styles.wrapResultShipping}>
                {
                    infoShipping.length > 0 ? (
                        error ? (
                            <span className={styles.wrapResultShipping}>{error}</span>
                        ) : (
                            <Result infShip={infoShipping} error={error} />
                        )
                    ) : (
                    ""
                )}

            </div>
        </div>
    )
}

CalculateShipping.schema = {
    title: "Editor Botão Consultar CEP",
    type: "object",
    properties: {
        colorBg: {
            title: "Cor do fundo do botão",
            type: "string",
            default: "#3c5ca7",
            description: "Você colocará a cor do fundo em Hezadecimal. Exemplo: #FF0000 = Cor vermelha"
        },
        colorkLetter: {
            title: "Cor das letras do botão",
            type: "string",
            default: "#fff",
            description: "Você colocará a cor da letra em Hezadecimal. Exemplo: #FF0000 = Cor vermelha"
        },
        textBtn: {            
            title: "Texto do botão",
            type: "string",
            default: "Consultar",
            description: "Aqui você colocará o texto desejado"
        }
    }
}

export default CalculateShipping;