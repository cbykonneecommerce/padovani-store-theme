export const schema = {
    title: 'Gerenciador da Página',
    type: 'object',
    properties: {
        disabledDev: {
            title: 'Desabilita componentes pesados para melhorar performance no site-editor',
            type: 'boolean',
            default: false
        },
        sections: {
            title: 'Seções',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    __editorItemTitle: {
                        title: "Nome do Componente",
                        type: 'string'
                    },
                    classe: {
                        title: "Classe de estilo",
                        type: 'string',
                        description: "Serve para facilitar a estilização (somente para dev)"
                    },
                    disabled: {
                        title: 'Desativa Componente?',
                        type: 'boolean',
                        default: false
                    },
                    padding: {
                        title: 'Inclui Espaçamento?',
                        type: 'boolean',
                        default: false
                    },
                    anchorComponent: {
                        title: 'Componente âncora?',
                        type: 'boolean',
                        default: false,
                        description: 'Clicar em um outro componente e navegar até esse'
                    },
                    backgroundColor: {
                        title: 'Cor do Background',
                        type: 'string',
                        enum:[
                            'background-blue',
                            'background-white',
                            'background-grey',
                        ],
                        enumNames: [
                            'Background Azul',
                            'Background Branco',
                            'Background Cinza'
                        ]
                    },
                    componentType: {
                        title: 'Componente',
                        type: 'string',
                        enum: [
                            'rich-text',
                            'banner',
                            'bannerBg',
                            'slider',
                            'faq',
                            "list-product",
                            "text-image"
                        ],
                        enumNames: [
                            'Bloco de Texto',
                            'Banner',
                            'Banner dinâmico',
                            'Slider',
                            'FAQ',
                            "Listagem de Produtos",
                            "Texto e Image"
                        ]
                    }
                },
                required: ['componentType', 'anchorComponent'],
                dependencies: {
                    anchorComponent: {
                        oneOf: [
                            {
                                properties: {
                                    anchorComponent: {
                                        enum: [true]
                                    },
                                    idAnchor: {
                                        title: 'Identificador',
                                        type: 'string',
                                        description: "Serve para indentificar o componente que será redirecionado (deve ser igual ao nome dado no componente de click)",
                                    }
                                }
                            },
                        ]
                    },
                    componentType: {
                        oneOf: [
                            {
                                properties: {
                                    componentType: {
                                        enum: ['rich-text']
                                    },
                                    richText: {
                                        title: 'Bloco de Texto',
                                        type: 'string',
                                        description: "em Markdown",
                                        default: "testando",
                                        widget: {
                                            'ui:widget': 'textarea',
                                        }
                                    },
                                    textAlign: {
                                        title: 'Alinhamento do Texto',
                                        type: 'string',
                                        enum: [
                                            'left',
                                            'center',
                                            'right'
                                        ],
                                        enumNames: [
                                            'À Esquerda',
                                            'Ao Centro',
                                            'À Direita'
                                        ],
                                    },
                                    hasSeeMoreButton: {
                                        title: 'Incluir botão de ver mais',
                                        type: 'boolean',
                                        default: false
                                    },

                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['banner']
                                    },
                                    image: {
                                        title: 'Imagem',
                                        type: 'object',
                                        properties: {
                                            imageDesk: {
                                                title: 'Imagem Desktop',
                                                type: 'string',
                                                widget: {
                                                    'ui:widget': 'image-uploader',
                                                },
                                            },
                                            imageMob: {
                                                title: 'Imagem Mobile',
                                                type: 'string',
                                                widget: {
                                                    'ui:widget': 'image-uploader',
                                                },
                                            },
                                            fullWidth: {
                                                title: 'Imagem com largura total?',
                                                type: 'boolean',
                                                default: false
                                            }
                                        }
                                    },
                                    activeText: {
                                        title: 'Ativa opções de Texto',
                                        type: 'boolean',
                                        default: false
                                    }
                                },
                                required: ['activeText'],
                                dependencies: {
                                    activeText: {
                                        oneOf: [
                                            {
                                                properties: {
                                                    activeText: {
                                                        enum: [true]
                                                    },
                                                    richText: {
                                                        title: 'Bloco de Texto',
                                                        type: 'string',
                                                        widget: {
                                                            'ui:widget': 'textarea',
                                                        }
                                                    },
                                                    colorWhite: {
                                                        title: 'Texto com cor Branca?',
                                                        type: 'boolean',
                                                        default: false
                                                    },
                                                    textAlign: {
                                                        title: 'Alinhamento do Texto',
                                                        type: 'string',
                                                        enum: [
                                                            'left',
                                                            'center',
                                                            'right'
                                                        ],
                                                        enumNames: [
                                                            'À Esquerda',
                                                            'Ao Centro',
                                                            'À Direita'
                                                        ],
                                                    },
                                                    link: {
                                                        title: 'URL para Link-Botão',
                                                        type: 'string'
                                                    },
                                                    textLink: {
                                                        title: 'Texto do Botão',
                                                        type: 'string',
                                                    },
                                                    target: {
                                                        title: 'Botão abre em nova aba?',
                                                        type: 'boolean',
                                                        default: false
                                                    },
                                                    horizontalAlignBlock: {
                                                        title: 'Alinhamento Horizontal do Bloco',
                                                        type: 'string',
                                                        enum: [
                                                            'flex-start',
                                                            'center',
                                                            'flex-end'
                                                        ],
                                                        enumNames: [
                                                            'À Esquerda',
                                                            'Ao Centro',
                                                            'À Direita'
                                                        ],
                                                    },
                                                    verticalAlignBlock: {
                                                        title: 'Alinhamento Vertical do Bloco',
                                                        type: 'string',
                                                        enum: [
                                                            'flex-start',
                                                            'center',
                                                            'flex-end'
                                                        ],
                                                        enumNames: [
                                                            'Ao Topo',
                                                            'Ao Centro',
                                                            'À Base'
                                                        ],
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['bannerBg']
                                    },
                                    backgroundClor: {
                                        title: "Cor de fundo",
                                        type: "string",
                                        widget: {
                                            "ui:widget": "color"
                                        }
                                    },
                                    image: {
                                        title: 'Imagem',
                                        type: 'object',
                                        properties: {
                                            imageDesk: {
                                                title: 'Imagem Desktop',
                                                type: 'string',
                                                widget: {
                                                    'ui:widget': 'image-uploader',
                                                },
                                            },
                                            imageMob: {
                                                title: 'Imagem Mobile',
                                                type: 'string',
                                                widget: {
                                                    'ui:widget': 'image-uploader',
                                                },
                                            }
                                        }
                                    },
                                    imageAlign: {
                                        title: 'Alinhamento da Imagem',
                                        type: 'string',
                                        enum: [
                                            'left',
                                            'right'
                                        ],
                                        enumNames: [
                                            'À Esquerda',
                                            'À Direita'
                                        ],
                                    },
                                    activeText: {
                                        title: 'Ativa opções de Texto',
                                        type: 'boolean',
                                        default: false
                                    },
                                    
                                },
                                required: ['activeText'],
                                dependencies: {
                                    activeText: {
                                        oneOf: [
                                            {
                                                properties: {
                                                    activeText: {
                                                        enum: [true]
                                                    },
                                                    richText: {
                                                        title: 'Bloco de Texto',
                                                        type: 'string',
                                                        widget: {
                                                            'ui:widget': 'textarea',
                                                        }
                                                    },
                                                    textColor: {
                                                        title: 'Cor do texto',
                                                        type: 'string',
                                                        enum: [
                                                            'black',
                                                            'white'
                                                        ],
                                                        enumNames: [
                                                            'Preta',
                                                            'Branca'
                                                        ],
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['faq']
                                    },
                                    faqType: {
                                        title: 'Modelo do FAQ',
                                        type: 'string',
                                        enum: [
                                            'model-blue',
                                            'model-white',
                                        ],
                                        enumNames: [
                                            'Modelo Azul',
                                            'Modelo Branco',
                                        ],
                                    },
                                    faq: {
                                        title: 'Itens do FAQ',
                                        type: 'array',
                                        items: {
                                            properties: {
                                                __editorItemTitle: {
                                                    title: 'Título do Item',
                                                    type: 'string',
                                                },
                                                text: {
                                                    title: 'Texto',
                                                    description: 'Aceita Markdown',
                                                    type: 'string',
                                                    widget: {
                                                        'ui:widget': 'textarea',
                                                    }
                                                },
                                                image: {
                                                    title: 'Imagens',
                                                    type: 'array',
                                                    items: {
                                                        properties: {
                                                            image: {
                                                                type: 'object',
                                                                properties: {
                                                                    imageUrl: {
                                                                        title: 'Imagem',
                                                                        type: 'string',
                                                                        widget: {
                                                                            'ui:widget': 'image-uploader',
                                                                        },
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['slider']
                                    },
                                    sliderType: {
                                        title: 'Tipo do Slider',
                                        type: 'string',
                                        enum: [
                                            'product',
                                            'image',
                                            'card'
                                        ],
                                        enumNames: [
                                            'Produtos',
                                            'Imagens',
                                            'Cards'
                                        ]
                                    },
                                },
                                required: ['sliderType'],
                                dependencies: {
                                    sliderType: {
                                        oneOf: [
                                            {
                                                properties: {
                                                    sliderType: {
                                                        enum: ['image']
                                                    },
                                                    images: {
                                                        title: "Imagens",
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                imageDesktop: {
                                                                    title: 'Imagem Desktop',
                                                                    type: 'string',
                                                                    widget: {
                                                                        'ui:widget': 'image-uploader',
                                                                    },
                                                                },
                                                                imageMobile: {
                                                                    title: 'Imagem Mobile',
                                                                    type: 'string',
                                                                    widget: {
                                                                        'ui:widget': 'image-uploader',
                                                                    },
                                                                },
                                                                altImage: {
                                                                    title: 'Descrição da imagem',
                                                                    type: 'string',
                                                                    widget: {
                                                                        'ui:widget': 'textarea',
                                                                    }
                                                                },
                                                                label: {
                                                                    title: 'Label da Imagem',
                                                                    type: 'string',
                                                                    description: 'Exibe um texto simples abaixo da imagem'
                                                                },
                                                                url: {
                                                                    title: 'URL da Imagem',
                                                                    type: 'string'
                                                                },
                                                                target: {
                                                                    title: 'Abre em nova aba?',
                                                                    type: 'boolean',
                                                                    default: false
                                                                },
                                                                hoverEffect:{
                                                                    title: 'Efeito Hover',
                                                                    type: 'string',
                                                                    enum: [
                                                                        "disabled",
                                                                        "opacity",
                                                                        "image-hover"
                                                                    ],
                                                                    enumNames:[
                                                                        "Desativado",
                                                                        "Efeito Opacidade",
                                                                        "Imagem Sobreposta"
                                                                    ]
                                                                }
                                                            },
                                                            required: ['hoverEffect'],
                                                            dependencies:{
                                                                hoverEffect: {
                                                                    oneOf: [
                                                                        {
                                                                            properties: {
                                                                                hoverEffect: {
                                                                                    enum: ['image-hover']
                                                                                },
                                                                                image:{
                                                                                    type: 'object',
                                                                                    properties: {
                                                                                        imageHover: {
                                                                                            title: 'Imagem Sobreposta',
                                                                                            type: 'string',
                                                                                            widget: {
                                                                                                'ui:widget': 'image-uploader',
                                                                                            },
                                                                                        },
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    },
                                                    infinite: {
                                                        title: 'Slider Infinito?',
                                                        type: 'boolean',
                                                        default: false
                                                    },
                                                    showNavigationArrows: {
                                                        title: "Exibe Flechas de Navegação?",
                                                        description: 'Caso não selecionado, o padrão será "Sempre"',
                                                        type: 'string',
                                                        enum: [
                                                            'always',
                                                            'never',
                                                            'desktopOnly',
                                                            'mobileOnly'
                                                        ],
                                                        enumNames: [
                                                            'Sempre',
                                                            'Nunca',
                                                            'Somente Desktop',
                                                            'Somente Mobile'
                                                        ],
                                                    },
                                                    showPaginationDots: {
                                                        title: "Exibe Pontos de Paginação?",
                                                        description: 'Caso não selecionado, o padrão será "Sempre"',
                                                        type: 'string',
                                                        enum: [
                                                            'always',
                                                            'never',
                                                            'desktopOnly',
                                                            'mobileOnly'
                                                        ],
                                                        enumNames: [
                                                            'Sempre',
                                                            'Nunca',
                                                            'Somente Desktop',
                                                            'Somente Mobile'
                                                        ],
                                                    },
                                                    itemsPerPageDesk: {
                                                        title: 'Itens por Página (Desktop)',
                                                        description: 'Caso não colocado, o padrão será 5',
                                                        type: 'number',
                                                        default: 5
                                                    },
                                                    itemsPerPageTablet: {
                                                        title: 'Itens por Página (Tablet)',
                                                        description: 'Caso não colocado, o padrão será 3',
                                                        type: 'number',
                                                        default: 3
                                                    },
                                                    itemsPerPagePhone: {
                                                        title: 'Itens por Página (Phone)',
                                                        description: 'Caso não colocado, o padrão será 1',
                                                        type: 'number',
                                                        default: 1
                                                    },
                                                    timeout: {
                                                        title: 'Autoplay - Tempo entre cada Slider (Segundos)',
                                                        description: 'Deixe em branco caso não queira o slider passando',
                                                        type: 'number'
                                                    },
                                                    stopOnHover: {
                                                        title: 'Autoplay - Para o autoplay on Hover',
                                                        description: 'Determina se a reprodução automática deve parar quando os usuários passarem o mouse sobre',
                                                        type: 'boolean',
                                                        default: false
                                                    }
                                                }
                                            },
                                            {
                                                properties: {
                                                    sliderType: {
                                                        enum: ['card']
                                                    },
                                                    cards: {
                                                        title: 'Cards',
                                                        type: 'array',
                                                        items: {
                                                            properties: {
                                                                __editorItemTitle: {
                                                                    title: 'Nome do Card',
                                                                    type: 'string',
                                                                    description: 'Nome para identificação'
                                                                },
                                                                image: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        imageUrl: {
                                                                            title: 'Imagem/Icon',
                                                                            type: 'string',
                                                                            widget: {
                                                                                'ui:widget': 'image-uploader',
                                                                            },
                                                                        }
                                                                    }
                                                                },
                                                                backgroundColor: {
                                                                    title: 'Cor do Background',
                                                                    type: 'string',
                                                                    enum:[
                                                                        'background-blue',
                                                                        'background-white',
                                                                        'background-grey',
                                                                    ],
                                                                    enumNames: [
                                                                        'Background Azul',
                                                                        'Background Branco',
                                                                        'Background Cinza'
                                                                    ]
                                                                },
                                                                altImage: {
                                                                    title: 'Descrição da imagem',
                                                                    type: 'string',
                                                                    widget: {
                                                                        'ui:widget': 'textarea',
                                                                    }
                                                                },
                                                                text: {
                                                                    title: 'Texto do Card',
                                                                    type: 'string',
                                                                    description: 'Aceita Markdown',
                                                                    widget: {
                                                                        'ui:widget': 'textarea',
                                                                    }
                                                                },
                                                                textAlign: {
                                                                    title: 'Alinhamento do Texto',
                                                                    type: 'string',
                                                                    enum: [
                                                                        'left',
                                                                        'center',
                                                                        'right'
                                                                    ],
                                                                    enumNames: [
                                                                        'À Esquerda',
                                                                        'Ao Centro',
                                                                        'À Direita'
                                                                    ],
                                                                },
                                                                buttonText: {
                                                                    title: 'Texto do Botão',
                                                                    type: 'string'
                                                                },
                                                                buttonUrl: {
                                                                    title: 'URL do Botão/Link',
                                                                    type: 'string',
                                                                    description: 'Caso não inserido, não exibirá botão'
                                                                },
                                                                target: {
                                                                    title: 'Botão abre em nova aba?',
                                                                    type: 'boolean',
                                                                    default: false
                                                                },
                                                                horizontalAlignBlock: {
                                                                    title: 'Alinhamento Horizontal do Bloco',
                                                                    type: 'string',
                                                                    enum: [
                                                                        'flex-start',
                                                                        'center',
                                                                        'flex-end'
                                                                    ],
                                                                    enumNames: [
                                                                        'À Esquerda',
                                                                        'Ao Centro',
                                                                        'À Direita'
                                                                    ],
                                                                },
                                                                verticalAlignBlock: {
                                                                    title: 'Alinhamento Vertical do Bloco',
                                                                    type: 'string',
                                                                    enum: [
                                                                        'flex-start',
                                                                        'center',
                                                                        'flex-end'
                                                                    ],
                                                                    enumNames: [
                                                                        'Ao Topo',
                                                                        'Ao Centro',
                                                                        'À Base'
                                                                    ],
                                                                }
                                                            }
                                                        }
                                                    },
                                                    infinite: {
                                                        title: 'Slider Infinito?',
                                                        type: 'boolean',
                                                        default: false
                                                    },
                                                    showNavigationArrows: {
                                                        title: "Exibe Flechas de Navegação?",
                                                        description: 'Caso não selecionado, o padrão será "Sempre"',
                                                        type: 'string',
                                                        enum: [
                                                            'always',
                                                            'never',
                                                            'desktopOnly',
                                                            'mobileOnly'
                                                        ],
                                                        enumNames: [
                                                            'Sempre',
                                                            'Nunca',
                                                            'Somente Desktop',
                                                            'Somente Mobile'
                                                        ],
                                                    },
                                                    showPaginationDots: {
                                                        title: "Exibe Pontos de Paginação?",
                                                        description: 'Caso não selecionado, o padrão será "Sempre"',
                                                        type: 'string',
                                                        enum: [
                                                            'always',
                                                            'never',
                                                            'desktopOnly',
                                                            'mobileOnly'
                                                        ],
                                                        enumNames: [
                                                            'Sempre',
                                                            'Nunca',
                                                            'Somente Desktop',
                                                            'Somente Mobile'
                                                        ],
                                                    },
                                                    itemsPerPageDesk: {
                                                        title: 'Itens por Página (Desktop)',
                                                        description: 'Caso não colocado, o padrão será 5',
                                                        type: 'number',
                                                        default: 5
                                                    },
                                                    itemsPerPageTablet: {
                                                        title: 'Itens por Página (Tablet)',
                                                        description: 'Caso não colocado, o padrão será 3',
                                                        type: 'number',
                                                        default: 3
                                                    },
                                                    itemsPerPagePhone: {
                                                        title: 'Itens por Página (Phone)',
                                                        description: 'Caso não colocado, o padrão será 1',
                                                        type: 'number',
                                                        default: 1
                                                    },
                                                    timeout: {
                                                        title: 'Autoplay - Tempo entre cada Slider (Segundos)',
                                                        description: 'Deixe em branco caso não queira o slider passando',
                                                        type: 'number'
                                                    },
                                                    stopOnHover: {
                                                        title: 'Autoplay - Para o autoplay on Hover',
                                                        description: 'Determina se a reprodução automática deve parar quando os usuários passarem o mouse sobre',
                                                        type: 'boolean',
                                                        default: false
                                                    }
                                                }
                                            },
                                            {
                                                properties: {
                                                    sliderType: {
                                                        enum: ['product']
                                                    },
                                                    listContext: {
                                                        type: 'object',
                                                        properties: {
                                                            category: {
                                                                title: 'Id da Categoria',
                                                                type: 'string',
                                                                description: 'Para subcategorias, use "/" (por exemplo: 1/2/3)'
                                                            },
                                                            orderby: {
                                                                title: "Ordenar por",
                                                                type: 'string',
                                                                default: ["OrderByTopSaleDESC"],
                                                                enum: [
                                                                    "OrderByTopSaleDESC",
                                                                    "OrderByReleaseDateDESC",
                                                                    "OrderByBestDiscountDESC",
                                                                    "OrderByPriceDESC",
                                                                    "OrderByPriceASC",
                                                                    "OrderByNameASC",
                                                                    "OrderByNameDESC"
                                                                ],
                                                                enumNames:[
                                                                    "Vendas",
                                                                    "Data de Lançamento",
                                                                    "Desconto",
                                                                    "Preço DESC",
                                                                    "Preço ASC",
                                                                    "Nome ASC",
                                                                    "Nome DESC"
                                                                ],
                                                                
                                                            },
                                                            collection: {
                                                                title: 'Coleção',
                                                                type: 'string'
                                                            },
                                                            hideUnavailableItems: {
                                                                title: 'Ocultar itens não disponíveis',
                                                                type: 'boolean',
                                                                default: false
                                                            },
                                                            maxItems: {
                                                                title: 'Quantidade máxima de itens',
                                                                type: 'number'
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['list-product']
                                    },
                                    title: {
                                        title: 'Título',
                                        type: 'string',
                                        default: 'Troque o título'
                                    },
                                    queryField: {
                                        title: 'Id da coleção',
                                        type: 'string',
                                        default: "153",
                                    },
                                    maxItemsPerPage: {
                                        title: 'Itens por Paginação',
                                        description: 'Caso não colocado, o padrão será 8. (Valor máximo suportado, 50. Recomenda-se 12, no máximo, por questões de performance..',
                                        type: 'number',
                                        default: 8
                                    },
                                    hideUnavailableItems: {
                                        title: 'Ocultar itens indisponíveis?',
                                        type: 'boolean',
                                        default: false
                                    },
                                    orderby: {
                                        title: "Ordenar por",
                                        type: 'string',
                                        default: ["OrderByScoreDESC"],
                                        enum: [
                                            "OrderByScoreDESC",
                                            "OrderByTopSaleDESC",
                                            "OrderByReleaseDateDESC",
                                            "OrderByBestDiscountDESC",
                                            "OrderByPriceDESC",
                                            "OrderByPriceASC",
                                            "OrderByNameASC",
                                            "OrderByNameDESC"
                                        ],
                                        enumNames: [
                                            "Relevância",
                                            "Vendas",
                                            "Data de Lançamento",
                                            "Desconto",
                                            "Preço DESC",
                                            "Preço ASC",
                                            "Nome ASC",
                                            "Nome DESC"
                                        ],
                                        
                                    },
                                }
                            },
                            {
                                properties: {
                                    componentType: {
                                        enum: ['text-image']
                                    },
                                    items: {
                                        title: 'Itens de Texto e Image',
                                        type: 'array',
                                        items: {
                                            properties: {
                                                __editorItemTitle: {
                                                    title: 'Título do Item',
                                                    type: 'string',
                                                },
                                                text: {
                                                    title: 'Texto',
                                                    description: 'Aceita Markdown',
                                                    type: 'string',
                                                    widget: {
                                                        'ui:widget': 'textarea',
                                                    }
                                                },
                                                image: {
                                                    type: 'object',
                                                    properties: {
                                                        imageUrl: {
                                                            title: 'Imagem',
                                                            type: 'string',
                                                            widget: {
                                                                'ui:widget': 'image-uploader',
                                                            },
                                                        },
                                                        imageAlt: {
                                                            title: 'Descrição da imagem',
                                                            type: 'string',
                                                            widget: {
                                                                'ui:widget': 'textarea',
                                                            }
                                                        }
                                                    }
                                                },
                                                alignImage: {
                                                    title: 'Alinhamento da Imagem',
                                                    type: 'string',
                                                    enum: [
                                                        'left',
                                                        'top',
                                                        'right'
                                                    ],
                                                    enumNames: [
                                                        'à esquerda',
                                                        'em cima do Texto',
                                                        'à direita'
                                                    ],
                                                },
                                                alignText: {
                                                    title: 'Alinhamento do Texto',
                                                    type: 'string',
                                                    enum: [
                                                        'text-left',
                                                        'text-center',
                                                        'text-right'
                                                    ],
                                                    enumNames: [
                                                        'à esquerda',
                                                        'ao centro',
                                                        'à direita'
                                                    ],
                                                    default: 'text-center'
                                                },
                                                hasBorder: {
                                                    title: 'Aplicar borda?',
                                                    type: 'boolean',
                                                    default: false
                                                },
                                                minHeight: {
                                                    title: 'Altura mínima do componente',
                                                    type: 'number',
                                                    default: 320,
                                                    description: 'Se não declaro, será padrão 320'
                                                },
                                                width: {
                                                    title: 'largura do componente',
                                                    type: 'number',
                                                    description: 'Valor calculado em porcentagem',
                                                    default: 50
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        ]
                    }
                }
            }
        }
    }
}