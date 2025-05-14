import waitForEl from "../helpers/waitForEl";
import ServiceExemple from "../services/ServiceExemple";

export default class Exemple {
    serviceExemple = new ServiceExemple();

    constructor() {
        this.init();
        this.selectors();
        this.events();
    }

    selectors() {
        this.title = $(".example-title");
    }

    events() {
        this.title.click(this.exempleEvent.bind(this));
    }

    init() {
        window.addEventListener("hashchange", () => {
            if (window.location.hash == "#/shipping") {
                waitForEl("#ship-complement")
                    .then
                    //develop
                    ();
            }
        });

        window.addEventListener("load", () => {
            if (window.location.hash != "#/cart") {
                waitForEl(".summary-cart-template-holder .hproduct .photo")
                    .then
                    //develop
                    ();
            }
        });

        $(window).on("orderFormUpdated.vtex", function () {
            const orderFormData = vtexjs.checkout.orderForm;
            let postalCode = null;

            if (
                orderFormData.shippingData &&
                orderFormData.shippingData.address &&
                orderFormData.shippingData.address.postalCode
            ) {
                postalCode = orderFormData.shippingData.address.postalCode;
            } else if (
                orderFormData.shippingData &&
                orderFormData.shippingData.availableAddresses.length > 0
            ) {
                postalCode =
                    orderFormData.shippingData.availableAddresses[0].postalCode; // Assume que o primeiro endereço disponível é o principal
            }

            if (!postalCode) {
                console.error(
                    "Postal Code não disponível. Requisição não será feita."
                );
                return;
            }

            orderFormData.items.forEach((item) => {
                const itemData = {
                    id: item.id,
                    quantity: item.quantity,
                    seller: "1",
                };

                fetch(
                    "/api/checkout/pub/orderForms/simulation?RnbBehavior=0&sc=1&individualShippingEstimates=true",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            items: [itemData],
                            postalCode: postalCode,
                            country: "BRA",
                            expectedOrderFormSections: [
                                "items",
                                "totalizers",
                                "shipping",
                            ],
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((dataResponse) => {
                        if (
                            dataResponse.logisticsInfo &&
                            dataResponse.logisticsInfo.length > 0
                        ) {
                            const shippingEstimates = dataResponse.logisticsInfo
                                .map((logistics) => {
                                    let sla = logistics.slas.find(
                                        (sla) => sla.id === "SEDEX"
                                    );

                                    if (!sla) {
                                        sla = logistics.slas.find(
                                            (sla) => sla.id === "Normal"
                                        );
                                    }

                                    return sla ? sla.shippingEstimate : null;
                                })
                                .filter(Boolean);

                            if (shippingEstimates.length > 0) {
                                let shippingEstimate = shippingEstimates[0];

                                shippingEstimate =
                                    shippingEstimate.match(/\d+/)[0];

                                if (
                                    !$(
                                        `.product-item[data-sku=${item.id}] .shipping-date .shipping-estimate-date`
                                    ).find(`.custom-message-${item.id}`).length
                                ) {
                                    const shippingMessage = `
                                    <p class='custom-message-info custom-message-${item.id}'>
                                        Em até ${shippingEstimate} dias úteis
                                    </p>
                                `;

                                    $(
                                        `.product-item[data-sku=${item.id}] .shipping-date .shipping-estimate-date`
                                    ).append(shippingMessage);
                                }
                            } else {
                                console.error(
                                    `Nenhum SLA com id 'SEDEX' encontrado para o item ${item.id}.`
                                );
                            }
                        } else {
                            console.error(
                                `Nenhuma informação de logisticsInfo encontrada para o item ${item.id}.`
                            );
                        }

                        const slaElements = $(
                            ".srp-shipping-current-single__sla.gray"
                        );

                        waitForEl(slaElements).then(() => {
                            slaElements.each(function () {
                                const slaText = $(this).text().trim();

                                if (slaText.includes("Pronto em até")) {
                                    $(".custom-message-info").hide();

                                    const shippingEstimateDateElement = $(
                                        ".shipping-estimate-date"
                                    );

                                    if (shippingEstimateDateElement.length) {
                                        shippingEstimateDateElement.addClass(
                                            "active"
                                        );
                                    }
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.error(`Erro para o item ${item.id}:`, error);
                    });
            });
        });

        $(window).on("orderFormUpdated.vtex", () => {
            if (window.location.hash != "#/cart") {
                waitForEl(".hproduct .photo").then(() => {
                    this.exempleMethod();
                });
            }
        });
    }

    exempleMethod() {
        this.title.addClass("teste");
        this.serviceExemple.getAllInfoClient(1);
    }
}
