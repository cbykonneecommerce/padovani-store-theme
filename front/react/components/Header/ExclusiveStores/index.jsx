import React from 'react'

import './global.css'

const ExclusiveStores = ({ store }) => {
    if (store.length === 0) return null
    return (
        <div className='exclusiveStores'>
            <h4 className='exclusiveStores__title'>Lojas Exclusivas</h4>
            <div className='exclusiveStores__links-container'>
                {store.map((loja, key) => (
                    <a key={key} className='exclusiveStores__link' href={loja.url}>
                        <img className='exclusiveStores__image' src={loja.image.imageUrl} alt={loja.__editorItemTitle} />
                    </a>
                ))}
            </div>
        </div>
    )
}

ExclusiveStores.schema = {
    title: 'Lojas Exclusivas',
    type: 'object',
    properties: {
        store: {
            title: 'Lojas',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    __editorItemTitle: {
                        title: 'Nome da Loja',
                        type: 'string',
                    },
                    url: {
                        title: 'URL de Redirecionamento',
                        type: 'string'
                    },
                    image: {
                        type: 'object',
                        properties: {
                            imageUrl: {
                                title: 'Imagem da Marca',
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

export default ExclusiveStores