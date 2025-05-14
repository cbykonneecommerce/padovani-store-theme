export default class CodeSeller {
    constructor() {
        this.idDocument = "";
        this.debounceTimer = null;
        this.hasVendorDisplayed = false; // Flag para garantir que o vendedor seja exibido uma vez
        this.init();
    }

    init() {
        this.validationContentMarketingData();
        this.loadSavedCoupon();
        this.handleCoupon();
        this.handleInputChange();

        setInterval(() => {
            const button = $("button#salesmancode-remove");

            if (!button.hasClass("active")) {
                this.removeCoupon();
            }
        }, 1000);
    }

    validationContentMarketingData() {
        fetch(`/api/checkout/pub/orderForm`)
            .then((res) => res.json())
            .then((orderForm) => {
                if (orderForm.marketingData?.utmiCampaign) {
                    if (!this.hasVendorDisplayed) {
                        this.resultVendorData(
                            orderForm.marketingData.utmiCampaign
                        );
                    }
                } else {
                    this.addInput();
                }
            });
    }

    resultVendorData(cod) {
        const _this = this;

        $.ajax({
            method: "GET",
            url: `/customrequest/getvendorcode/${cod}`,
            success: function (response) {
                if (response.length > 0) {
                    _this.showVendorInfo(response[0]);
                } else {
                    $(".salesman-result").html(
                        '<div class="error">Código de Vendedor inválido!</div>'
                    );
                }
            },
            error: function (erro) {
                console.error(erro);
                $(".salesman-result").html(
                    '<div class="error">Erro na busca do código do vendedor</div>'
                );
            },
        });
    }

    showVendorInfo(vendorData) {
        // Verifica se já foi exibido para evitar repetição
        $(".salesman-resultt").remove();

        let html = `
            <div class="salesman-resultt">
                <div class="show-salesmancode">Vendedor: ${vendorData.codigovendedor} - ${vendorData.nome}</div>
                <button id="salesmancode-remove" class="cart-salesmancode-remove">Remover</button>
            </div>
        `;

        this.waitForEl(".forms.coupon-column.summary-coupon-wrap").then(() => {
            $(".forms.coupon-column.summary-coupon-wrap").prepend(html);
            this.hasVendorDisplayed = true;
            this.removeCoupon();
            this.loadSavedCoupon();
        });

        vtexjs.checkout.setCustomData({
            app: "codigovendedor",
            field: "codigoVendedor",
            value: `${vendorData.codigovendedor}`,
        });

        vtexjs.checkout.getOrderForm().then(function (orderForm) {
            const marketingData = orderForm.marketingData;
            marketingData.utmiCampaign = `${vendorData.codigovendedor}`;

            return vtexjs.checkout.sendAttachment(
                "marketingData",
                marketingData
            );
        });

        this.removeCoupon();
    }

    addInput() {
        const _this = this;

        if ($(".salesman-coupon").length === 0) {
            let html = `
        <div class="salesman-coupon new-code-salesman">
          <span class="title-salesman-coupon">Código do Vendedor</span>
          <form class="salesman-coupon-form">
            <input type="text" placeholder="Escreva o Código do Vendedor" name="codigovendedor" id="codigovendedor" />
            <button type="submit" class="coupon-send">Aplicar</button>
          </form>
          <div class="salesman-result"></div>
        </div>
      `;

            _this
                .waitForEl(".forms.coupon-column.summary-coupon-wrap")
                .then(() => {
                    $(".forms.coupon-column.summary-coupon-wrap").prepend(html);
                    _this.loadSavedCoupon();
                });
        }
    }

    handleInputChange() {
        const _this = this;

        $(document).on("input", "#codigovendedor", function () {
            const inputValue = $(this).val();

            if (_this.debounceTimer) {
                clearTimeout(_this.debounceTimer);
            }

            _this.debounceTimer = setTimeout(() => {
                if (inputValue) {
                    _this.fetchVendorData(inputValue);
                } else {
                    $(".salesman-result").html("");
                }
            }, 500);
        });
    }

    fetchVendorData(cod) {
        const _this = this;

        $.ajax({
            method: "GET",
            url: `/customrequest/getvendorcode/${cod}`,
            success: function (response) {
                if (response.length > 0) {
                    _this.showVendorData(response[0]);
                } else {
                    $(".salesman-result").html(
                        '<div class="error">Código de Vendedor inválido!</div>'
                    );
                }
            },
            error: function (erro) {
                console.error(erro);
                $(".salesman-result").html(
                    '<div class="error">Erro na busca do código do vendedor</div>'
                );
            },
        });
    }

    showVendorData(vendorData) {
        const html = `
        <div class="show-salesmancode">
            Vendedor: ${vendorData.codigovendedor} - ${vendorData.nome}
        </div>
        `;
        $(".salesman-result").html(html);
    }

    handleCoupon() {
        const _this = this;

        $(document).on("submit", "form.salesman-coupon-form", function (e) {
            e.preventDefault();

            let cod = $(this).find("#codigovendedor").val();

            $.ajax({
                method: "GET",
                url: `/customrequest/getvendorcode/${cod}`,
                success: function (response) {
                    if (response.length > 0) {
                        _this.idDocument = response[0].id;
                        _this.infoVendedor(_this.idDocument);
                        $(".salesman-coupon-form").hide();
                        $(".title-salesman-coupon").hide();
                    } else {
                        alert(
                            "Código de Vendedor inválido! Tente outro código"
                        );
                    }
                },
                error: function (erro) {
                    console.error(erro);
                },
            });
        });
    }

    infoVendedor(idDocument) {
        const _this = this;

        $.ajax({
            method: "GET",
            url: `/customrequest/getvendordata/${idDocument}`,
            success: function (response) {
                if (response.status) {
                    _this.contentValidCoupon(response);
                    _this.saveCouponToLocalStorage(response);
                } else {
                    alert("Código de Vendedor inválido! Tente outro código");
                }
            },
            error: function (erro) {
                console.error(erro);
            },
        });
    }

    contentValidCoupon(content) {
        if (!window.vtexjs) {
            return;
        }

        const _this = this;

        const html = `
            <div class="show-salesmancode">
                Vendedor: ${content.codigovendedor} - ${content.nome}
            </div>
            <button id="salesmancode-remove" class="cart-salesmancode-remove">
                Remover
            </button>
        `;

        $(".salesman-result").html(html);

        vtexjs?.checkout?.setCustomData({
            app: "codigovendedor",
            field: "codigoVendedor",
            value: `${content.codigovendedor}`,
        });

        vtexjs.checkout.getOrderForm().then(function (orderForm) {
            const marketingData = orderForm.marketingData;
            marketingData.utmiCampaign = `${content.codigovendedor}`;

            return vtexjs.checkout.sendAttachment(
                "marketingData",
                marketingData
            );
        });

        _this.removeCoupon();
    }

    removeCoupon() {
        $("button#salesmancode-remove").addClass("active");

        $("button#salesmancode-remove").on("click", () => {
            $(".show-salesmancode, .cart-salesmancode-remove").hide();
            $(".salesman-coupon-form").show();
            $(".title-salesman-coupon").show();

            localStorage.removeItem("salesmanData");

            const options = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };

            fetch(
                `/api/checkout/pub/orderForm/${vtexjs?.checkout?.orderFormId}/customData/codigovendedor/codigoVendedor`,
                options
            )
                .then((response) => response.json())
                .catch((error) => {
                    console.error("Erro ao remover customData:", error);
                });

            vtexjs.checkout.getOrderForm().then(function (orderForm) {
                const marketingData = orderForm.marketingData;
                marketingData.utmiCampaign = null;

                return vtexjs.checkout.sendAttachment(
                    "marketingData",
                    marketingData
                );
            });

            this.addInput();
        });
    }

    saveCouponToLocalStorage(content) {
        const salesmanData = {
            codigovendedor: content.codigovendedor,
            nome: content.nome,
        };
        localStorage.setItem("salesmanData", JSON.stringify(salesmanData));
    }

    loadSavedCoupon() {
        if (!window.vtexjs) {
            return;
        }

        const _this = this;

        const savedData = localStorage.getItem("salesmanData");

        if (savedData) {
            const content = JSON.parse(savedData);

            const html = `
                <div class="show-salesmancode">
                    Vendedor: ${content.codigovendedor} - ${content.nome}
                </div>
                <button id="salesmancode-remove" class="cart-salesmancode-remove">
                    Remover
                </button>`;

            $(".salesman-result").html(html);
            $(".salesman-coupon-form").hide();
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
