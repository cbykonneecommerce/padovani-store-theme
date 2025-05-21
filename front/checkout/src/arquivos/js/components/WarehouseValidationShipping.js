export default class WarehouseValidation {
    constructor() {
        this.init();
    }

    init() {
        $(document).ready(() => {
            $(window).on("orderFormUpdated.vtex", () => {
                this.validationWarehouseId();
            });
        });
    }

    validationWarehouseId() {
        const orderForm = vtexjs.checkout.orderForm;

        this.waitForEl(".product-item")
            .then(() => {
                this.createWarehouseMessage();
            })
            .catch((error) => {
                console.error(
                    "Erro ao esperar pelos elementos dinâmicos:",
                    error
                );
            });
    }

    createWarehouseMessage() {
        const orderForm = vtexjs.checkout.orderForm;

        if (!orderForm.shippingData || !orderForm.shippingData.logisticsInfo) {
            console.warn("Dados de logística não encontrados no orderForm.");
            return;
        }

        orderForm.items.forEach((item, index) => {
            const skuId = item.id;
            const logisticInfo = orderForm.shippingData.logisticsInfo[index];

            if (
                !logisticInfo ||
                !logisticInfo.slas ||
                logisticInfo.slas.length === 0
            ) {
                console.warn(
                    `LogisticsInfo não encontrado para o item ${item.name}.`
                );
                return;
            }

            const dockId = logisticInfo.slas[0]?.deliveryIds?.[0]?.dockId;
            console.log(
                `SKU: ${skuId}, dockId: ${dockId}, Produto: ${item.name}`
            );

            const productContainer = $(`.product-item[data-sku='${skuId}']`);

            if (productContainer.length > 0) {
                const shippingContainer =
                    productContainer.find(".shipping-date");

                if (shippingContainer.length > 0) {
                    shippingContainer.find(".warehouse-message").remove();

                    const messageText =
                        dockId === "ENC"
                            ? "Venda sob encomenda"
                            : "Produto a pronta entrega";

                    const messageElement = $("<small>", {
                        class: "warehouse-message",
                        text: messageText,
                    });

                    shippingContainer.append(messageElement);

                    console.log(
                        `Mensagem "${messageText}" adicionada ao produto ${item.name} (SKU: ${skuId})`
                    );
                } else {
                    console.warn(
                        `Elemento "shipping-date" não encontrado para o SKU ${skuId}.`
                    );
                }
            } else {
                console.warn(
                    `Elemento com data-sku ${skuId} não encontrado no DOM.`
                );
            }
        });
    }

    waitForEl(selector) {
        return new Promise((resolve) => {
            if ($(selector).length) {
                resolve($(selector));
                return;
            }

            const observer = new MutationObserver(() => {
                if ($(selector).length) {
                    resolve($(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }
}
