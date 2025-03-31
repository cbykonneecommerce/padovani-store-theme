import React from 'react'

const ContainerStopPropagation = ({ children }) => {
    //doc: esse componente serve de container para evitar propagação de evento
    //caso de uso: shelf tem um link e dentro tem um botão de compra. Ao clicar no botão, redireciona para o produto
    // ao inves de realizar a ação de compra. Esse componente para o evento de link nesse caso.
  return (
    <a
    href={`javascript:void(0)`}
    onClick={event => { event.stopPropagation() }}
    style={{zIndex: 4}}
    >
         {children}
    </a>
  )
}
export default ContainerStopPropagation
