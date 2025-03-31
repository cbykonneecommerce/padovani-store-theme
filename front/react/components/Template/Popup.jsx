import { useState, useEffect } from "react"
import styles from "../../styles/css/template.popup.css"
import Forms from "./Forms"
import CloseIcon from "../../UI/CloseIcon/CloseIcon";

const Popup = (props) => {
    const [popupOpen, setPopupOpen] = useState(false);
    
    function closeModal() {
        setCookie("popupClosed", "true", 15);
        setPopupOpen(false)
    }

    function setCookie(name, value, days) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
        document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    };
      
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
            return cookieValue;
            }
        }
        return null;
    };

    useEffect(() => {
        const isPopupClosed = getCookie("popupClosed");
        if (isPopupClosed) {
            setPopupOpen(false);
        } else {
            // setTimeout(() => {
            //     setPopupOpen(true);
            // }, 10000);
            setPopupOpen(true)
        }
    }, []);

    if (!props.popupActive || !popupOpen) return <></>
    
    return(
        <div className={styles.PopupContainer}>
            <div className={styles.PopupOverlay} onClick={closeModal}></div>
            <div className={styles.PopupWrapper}>
                {props.imageDescriptionPopup && props?.imagePopup && (
                    <img src={props?.imagePopup} alt={props?.imageDescriptionPopup} />
                )}
                <Forms closeModal={closeModal} {...props} />
                <CloseIcon closeModal={closeModal} />
            </div>

        </div>
    )
}

Popup.schema = {
    title: "Popup",
    type: "object",
    properties: {
        popupActive: {
            title: "Popup Ativo",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: false
        },
        imagePopup: {
            title: "Imagem Popup",
            type: "string",
            widget: {
                'ui:widget': 'image-uploader',
            }
        },
        imageDescriptionPopup: {
            title: "Descrição da imagem Popup",
            type: "string",
            widget: {
                'ui:widget': 'textarea',
            }
        },
        isActive: {
            title: "Formulário Ativo",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: false
        },
        title: {
            title: "Título",
            type: "string"
        },
        description: {
            title: "Texto",
            type: "string",
            widget: {
                'ui:widget': 'textarea',
            }
        },
        showLabel: {
            title: "Mostrar Label",
            type: "boolean",
            widget: {
                'ui:widget': 'checkbox',
            },
            default: false
        },
        entity: {
            title: "Entidade de Dados",
            type: "string"
        },
        gap: {
            title: "Espaçamento entre os campos",
            type: "string"
        },
        fields: {
            title: "Campos",
            type: "array",
            items: {
                properties: {
                    __editorItemTitle: {
                        title: "Título",
                        type: "string"
                    },
                    name: {
                        title: "Nome do campo no MasterData",
                        type: "string"
                    },
                    placeholder: {
                        title: "Placeholder",
                        type: "string"
                    },
                    label: {
                        title: "Label",
                        type: "string",
                        description: "Nome Vísivel"
                    },
                    type: {
                        title: "Tipo",
                        type: "string",
                        enum: [
                            "title",
                            "submit",
                            "whatsapp",
                            "cep",
                            "date",
                            "phone",
                            "cpf",
                            "cnpj",
                            "cpfcnpj",
                            "email",
                            "text",
                            "textarea",
                            "checkbox",
                            "radio",
                            "checkbox-description",
                            "select",
                            "address",
                            "file"
                        ],
                        widget: {
                            'ui:widget': 'select',
                        },
                    },
                    size: {
                        title: "Largura",
                        type: "string",
                        description: "Largura do campo em porcentagem ex: 50%"
                    },
                    required: {
                        title: "É obrigatório?",
                        type: "boolean",
                        widget: {
                            'ui:widget': 'checkbox',
                        }
                    },
                    checked: {
                        title: "Em caso de checkbox inicia com check?",
                        type: "boolean",
                        widget: {
                            'ui:widget': 'checkbox',
                        }
                    },
                    description: {
                        title: "Descrição",
                        type: "string",
                        widget: {
                            'ui:widget': 'textarea',
                        }
                    },
                    options: {
                        title: "Opções",
                        type: "array",
                        description: "Para o tipo Rádio ou Select",
                        items: {
                            properties: {
                                __editorItemTitle: {
                                    title: "Nome do campo",
                                    type: "string",
                                    description: "Apenas no site editor"
                                },
                                label: {
                                    title: "Label",
                                    type: "string",
                                    description: "Nome Vísivel"
                                },
                                value: {
                                    title: "Valor",
                                    type: "string",
                                    description: "Valor salvo no Master Data"
                                },
                            }
                        }
                    }
                }
            }
        },
        message: {
            title: "Mensagem",
            type: "object",
            properties: {
                success: {
                    title: "Mensagem de Sucesso",
                    type: "string",
                    widget: {
                        'ui:widget': 'textarea',
                    }
                },
                error: {
                    title: "Mensagem de Erro",
                    type: "string",
                    description: "Após a mensagem será informado o tipo de erro.",
                    widget: {
                        'ui:widget': 'textarea',
                    }
                }
            }
        }
    }
}

export default Popup