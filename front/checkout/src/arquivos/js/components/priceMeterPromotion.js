export default class priceMeterPromotion {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            $(window).on("orderFormUpdated.vtex", () => {
                this.validationPriceMeterPromotion();
            });

            $(window).on("hashchange", () => {
                this.validationPriceMeterPromotion();
            });
        });
    }

    validationPriceMeterPromotion() {
        this.waitForEl(".new-product-real-price-per-unit")
            .then(() => {
                this.createPriceMeterPromotion();
            })
            .catch((error) => {
                console.error("Erro ao esperar pelo elemento:", error);
            });
    }

    createPriceMeterPromotion() {
        const orderForm = vtexjs.checkout.orderForm;

        const discountData =
            orderForm.ratesAndBenefitsData.rateAndBenefitsIdentifiers.find(
                (identifier) => {
                    return identifier.name && /\d+%/.test(identifier.name); // Identifica descontos por porcentagem
                }
            );

        if (!discountData) {
            console.warn(
                "Nenhum cupom com desconto foi encontrado no orderForm."
            );
            return;
        }

        const discountMatch = discountData.name.match(/(\d+)%/);
        const discountPercentage = discountMatch
            ? parseInt(discountMatch[1], 10)
            : 0;

        if (discountPercentage > 0) {
            orderForm.items.forEach((item, index) => {
                const originalPricePerM2 = item.price / 100;
                const discountedPricePerM2 =
                    originalPricePerM2 * (1 - discountPercentage / 100);

                const formattedPrice = discountedPricePerM2
                    .toFixed(2)
                    .replace(".", ",");

                const productContainer = $(`.product-item`).eq(index);

                if (productContainer.length > 0) {
                    const originalPriceElement = productContainer
                        .find(".new-product-real-price-per-unit")
                        .not(".discounted");
                    const originalPriceText = originalPriceElement
                        .text()
                        .trim();

                    if (
                        !originalPriceText ||
                        isNaN(
                            parseFloat(
                                originalPriceText
                                    .replace("R$", "")
                                    .replace(",", ".")
                            )
                        )
                    ) {
                        console.warn(
                            `Produto "${item.name}" não possui um preço válido por m². Ignorando.`
                        );
                        return;
                    }

                    if (
                        productContainer.attr("data-discount-applied") ===
                        "true"
                    ) {
                        console.log(
                            `Desconto já aplicado ao item "${item.name}". Ignorando.`
                        );
                        return;
                    }

                    productContainer
                        .find(".new-product-real-price-per-unit.discounted")
                        .remove();

                    const newPriceElement = $("<small>", {
                        class: "new-product-real-price-per-unit discounted",
                        text: `R$ ${formattedPrice} / m²`,
                    });

                    originalPriceElement.hide();

                    productContainer
                        .find(".product-price")
                        .append(newPriceElement);

                    productContainer.attr("data-discount-applied", "true");
                } else {
                    console.warn(
                        `Produto "${item.name}" não encontrado no DOM.`
                    );
                }
            });
        } else {
            console.warn("Nenhum desconto percentual válido foi identificado.");
        }
    }

    waitForEl(selector) {
        return new Promise((resolve) => {
            if ($(selector).length) {
                resolve($(selector));
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
