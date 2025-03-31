import React from 'react'
import './global.css'

const MostSearched = ({ mainText, linksArray }) => {
    if(!linksArray || linksArray.length === 0) return null

    return (
        <div className='most-searched'>
            <h3 className='most-searched__title'>{mainText}</h3>
            <div className='most-searched__links-container'>
                {linksArray.map((link)=> (
                    <>
                        <a className='most-searched__link' href={link.url}>{link.__editorItemTitle}</a>
                    </>
                ))}
            </div>
        </div>
    )
}

MostSearched.schema = {
    title: 'Mais Buscados',
    type: 'object',
    properties: {
        mainText: {
            title: 'Texto principal',
            type: 'string'
        },
        linksArray: {
            title: 'Lista de Mais Buscados',
            type: 'array',
            maxItems: 8,
            items: {
                type: 'object',
                properties: {
                    __editorItemTitle: {
                        title: 'Nome da Marca',
                        type: 'string'
                    },
                    url: {
                        title: 'URL da Marca',
                        type: 'string'
                    }
                }
            }
        }
    }
}

export default MostSearched