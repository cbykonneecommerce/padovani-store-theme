//basicamente, chamando essa funcão, ao atualizar o orderForm a vtex atualiza os estados internos da pagina
//sem a necessidade de recarregar a página.
export function updateVtexJs() {
    vtexjs.checkout.getOrderForm();
}
