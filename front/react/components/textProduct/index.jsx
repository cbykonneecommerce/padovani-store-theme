import React, { useState } from 'react';

function TextProduct({ texto = "", comprimentoMaximo = 364, titulo = "Ler mais.." }) {
  const [expandido, setExpandido] = useState(false);

  const exibirTextoCompleto = texto.length <= comprimentoMaximo || expandido;

  const toggleExpandido = () => {
    setExpandido(!expandido);
  };

  return (
    <div className='vtex-flex-layout-0-x-flexRowContent--home-seo-new'>
      <div className='vtex-flex-layout-0-x-flexRowContent--home-seo-new-down' dangerouslySetInnerHTML={{ __html: exibirTextoCompleto ? texto : texto.slice(0, comprimentoMaximo) + '...' }} />
      {!exibirTextoCompleto && (
        <button className='vtex-flex-layout-0-x-flexRowContent--home-seo-new-down-button' onClick={toggleExpandido}>{titulo}</button>
      )}
  
    </div>
  );
}

TextProduct.getSchema = () => {
  return {
    title: 'Texto "LER MAIS"',
    description: 'Texto "LER MAIS"',
    type: 'object',
    properties: {
      texto: {
        type: 'string',
        title: 'Conteúdo',
        description: 'Texto'
      },
      comprimentoMaximo: {
        type: 'number',
        title: 'Comprimento máximo',
        description: 'Comprimento máximo do texto antes de ser truncado'
      },
      titulo: {
        type: 'string',
        title: 'Título',
        description: 'Título do componente'
      }
    }
  };
};

export default TextProduct;
