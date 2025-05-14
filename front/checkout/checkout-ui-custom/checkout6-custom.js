/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/arquivos/js/components/CodeSeller.js":
/*!**************************************************!*\
  !*** ./src/arquivos/js/components/CodeSeller.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CodeSeller; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
class CodeSeller {
    constructor() {
        this.idDocument = "";
        this.debounceTimer = null;
        this.hasVendorDisplayed = false; // Flag para garantir que o vendedor seja exibido uma vez
        this.init();
    }

    init() {
        this.validationContentMarketingData()
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
        fetch(`/api/checkout/pub/orderForm`).then(res => res.json()).then((orderForm) => {
            if (orderForm.marketingData?.utmiCampaign) {
                if (!this.hasVendorDisplayed) {
                    this.resultVendorData(orderForm.marketingData.utmiCampaign);
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

        this.waitForEl(".forms.coupon-column.summary-coupon-wrap")
            .then(() => {
                $(".forms.coupon-column.summary-coupon-wrap").prepend(html);
                this.hasVendorDisplayed = true;
                this.removeCoupon();
                this.loadSavedCoupon();
            });
    

        vtexjs.checkout.setCustomData({ app: 'codigovendedor', field: 'codigoVendedor', value: `${vendorData.codigovendedor}` });

        vtexjs.checkout.getOrderForm().then(function (orderForm) {
            const marketingData = orderForm.marketingData;
            marketingData.utmiCampaign = `${vendorData.codigovendedor}`;

            return vtexjs.checkout.sendAttachment("marketingData", marketingData);
        }).done(function (orderForm) {
            console.log(orderForm.marketingData, "marketingData atualizado");
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

        vtexjs?.checkout?.setCustomData({ app: 'codigovendedor', field: 'codigoVendedor', value: `${content.codigovendedor}` });

        vtexjs.checkout.getOrderForm().then(function (orderForm) {
            const marketingData = orderForm.marketingData;
            marketingData.utmiCampaign = `${content.codigovendedor}`;

            return vtexjs.checkout.sendAttachment("marketingData", marketingData);
        }).done(function (orderForm) {
            console.log(orderForm.marketingData, "marketingData atualizado");
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
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error("Erro ao remover customData:", error);
                });

            vtexjs.checkout.getOrderForm().then(function (orderForm) {
                const marketingData = orderForm.marketingData;
                marketingData.utmiCampaign = null;

                return vtexjs.checkout.sendAttachment("marketingData", marketingData);
            }).done(function (orderForm) {
                console.log(orderForm.marketingData, "Código de vendedor removido");
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


/***/ }),

/***/ "./src/arquivos/js/components/Exemple.js":
/*!***********************************************!*\
  !*** ./src/arquivos/js/components/Exemple.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Exemple; }
/* harmony export */ });
/* harmony import */ var _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/waitForEl */ "./src/arquivos/js/helpers/waitForEl.js");
/* harmony import */ var _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/ServiceExemple */ "./src/arquivos/js/services/ServiceExemple.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");



class Exemple {
    serviceExemple = new _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__["default"]();

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
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])("#ship-complement")
                    .then
                    //develop
                    ();
            }
        });

        window.addEventListener("load", () => {
            if (window.location.hash != "#/cart") {
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])(".summary-cart-template-holder .hproduct .photo")
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
                        console.log(dataResponse, "dataResponse");

                        if (
                            dataResponse.logisticsInfo &&
                            dataResponse.logisticsInfo.length > 0
                        ) {
                            const shippingEstimates = dataResponse.logisticsInfo
                            .map((logistics) => {
                                let sla = logistics.slas.find((sla) => sla.id === "SEDEX");
        
                                if (!sla) {
                                    sla = logistics.slas.find((sla) => sla.id === "Normal");
                                }
        
                                return sla ? sla.shippingEstimate : null;
                            })
                            .filter(Boolean);

                            if (shippingEstimates.length > 0) {
                                let shippingEstimate = shippingEstimates[0];
                                console.log(shippingEstimate, "shippingEstimate");

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

                        (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])(slaElements).then(() => {
                            slaElements.each(function () {
                                const slaText = $(this).text().trim(); 
    
                                if (slaText.includes("Pronto em até")) {
                                    $(".custom-message-info").hide();
    
                                    const shippingEstimateDateElement = $(".shipping-estimate-date")
             
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
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])(".hproduct .photo").then(() => {
                    this.exempleMethod();
                });
            }
        });
    }

    exempleEvent(event) {
        console.log("event", event);
    }

    exempleMethod() {
        this.title.addClass("teste");
        this.serviceExemple.getAllInfoClient(1);
    }
}


/***/ }),

/***/ "./src/arquivos/js/components/priceMeterPromotion.js":
/*!***********************************************************!*\
  !*** ./src/arquivos/js/components/priceMeterPromotion.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ priceMeterPromotion; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
class priceMeterPromotion {
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

    const discountData = orderForm.ratesAndBenefitsData.rateAndBenefitsIdentifiers.find((identifier) => {
      return identifier.name && /\d+%/.test(identifier.name); // Identifica descontos por porcentagem
    });

    if (!discountData) {
      console.warn("Nenhum cupom com desconto foi encontrado no orderForm.");
      return;
    }

    const discountMatch = discountData.name.match(/(\d+)%/);
    const discountPercentage = discountMatch ? parseInt(discountMatch[1], 10) : 0;

    if (discountPercentage > 0) {
      orderForm.items.forEach((item, index) => {
        const originalPricePerM2 = item.price / 100; 
        const discountedPricePerM2 = originalPricePerM2 * (1 - discountPercentage / 100);

        const formattedPrice = discountedPricePerM2.toFixed(2).replace('.', ',');

        const productContainer = $(`.product-item`).eq(index); 

        if (productContainer.length > 0) {
          const originalPriceElement = productContainer.find('.new-product-real-price-per-unit').not('.discounted');
          const originalPriceText = originalPriceElement.text().trim();

          if (!originalPriceText || isNaN(parseFloat(originalPriceText.replace('R$', '').replace(',', '.')))) {
            console.warn(`Produto "${item.name}" não possui um preço válido por m². Ignorando.`);
            return;
          }

          if (productContainer.attr('data-discount-applied') === 'true') {
            console.log(`Desconto já aplicado ao item "${item.name}". Ignorando.`);
            return;
          }

          productContainer.find('.new-product-real-price-per-unit.discounted').remove();

          const newPriceElement = $('<small>', {
            class: 'new-product-real-price-per-unit discounted',
            text: `R$ ${formattedPrice} / m²`,
          });

          originalPriceElement.hide();

          productContainer.find('.product-price').append(newPriceElement);

          productContainer.attr('data-discount-applied', 'true');
        } else {
          console.warn(`Produto "${item.name}" não encontrado no DOM.`);
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


/***/ }),

/***/ "./src/arquivos/js/helpers/waitForEl.js":
/*!**********************************************!*\
  !*** ./src/arquivos/js/helpers/waitForEl.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ waitForEl; }
/* harmony export */ });
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
/**
 * Espera um elemento exitir no dom e executa o callback
 *
 * @param {string} selector seletor do elemento que dejesa esperar pela criação
 * @param {function} callback Função a ser executada quando tal elemento existir
 */

function waitForEl(selector) {
    return new Promise((resolve) => {
        function waitForElCb(s) {
            const el = jQuery(s);
            if (el.length) {
                resolve(el);
            } else {
                setTimeout(function () {
                    waitForElCb(selector);
                }, 100);
            }
        }
        waitForElCb(selector);
    });
}


/***/ }),

/***/ "./src/arquivos/js/lib/jquery.mask.min.js":
/*!************************************************!*\
  !*** ./src/arquivos/js/lib/jquery.mask.min.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
/* eslint-disable no-empty */
// jQuery Mask Plugin v1.14.16
// github.com/igorescobar/jQuery-Mask-Plugin
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (a, n, f) {
    a instanceof String && (a = String(a));
    for (var p = a.length, k = 0; k < p; k++) {
        var b = a[k];
        if (n.call(f, b, k, a)) return { i: k, v: b };
    }
    return { i: -1, v: void 0 };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, n, f) {
              a != Array.prototype && a != Object.prototype && (a[n] = f.value);
          };
$jscomp.getGlobal = function (a) {
    return "undefined" != typeof window && window === a
        ? a
        : "undefined" != typeof __webpack_require__.g && null != __webpack_require__.g
        ? __webpack_require__.g
        : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, n, f, p) {
    if (n) {
        f = $jscomp.global;
        a = a.split(".");
        for (p = 0; p < a.length - 1; p++) {
            var k = a[p];
            k in f || (f[k] = {});
            f = f[k];
        }
        a = a[a.length - 1];
        p = f[a];
        n = n(p);
        n != p &&
            null != n &&
            $jscomp.defineProperty(f, a, {
                configurable: !0,
                writable: !0,
                value: n,
            });
    }
};
$jscomp.polyfill(
    "Array.prototype.find",
    function (a) {
        return a
            ? a
            : function (a, f) {
                  return $jscomp.findInternal(this, a, f).v;
              };
    },
    "es6",
    "es3"
);
(function (a, n, f) {
     true
        ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        : 0;
})(
    function (a) {
        var n = function (b, d, e) {
            var c = {
                invalid: [],
                getCaret: function () {
                    try {
                        var a = 0,
                            r = b.get(0),
                            h = document.selection,
                            d = r.selectionStart;
                        if (
                            h &&
                            -1 === navigator.appVersion.indexOf("MSIE 10")
                        ) {
                            var e = h.createRange();
                            e.moveStart("character", -c.val().length);
                            a = e.text.length;
                        } else if (d || "0" === d) a = d;
                        return a;
                    } catch (C) {}
                },
                setCaret: function (a) {
                    try {
                        if (b.is(":focus")) {
                            var c = b.get(0);
                            if (c.setSelectionRange) c.setSelectionRange(a, a);
                            else {
                                var g = c.createTextRange();
                                g.collapse(!0);
                                g.moveEnd("character", a);
                                g.moveStart("character", a);
                                g.select();
                            }
                        }
                    } catch (B) {}
                },
                events: function () {
                    b.on("keydown.mask", function (a) {
                        b.data("mask-keycode", a.keyCode || a.which);
                        b.data("mask-previus-value", b.val());
                        b.data("mask-previus-caret-pos", c.getCaret());
                        c.maskDigitPosMapOld = c.maskDigitPosMap;
                    })
                        .on(
                            a.jMaskGlobals.useInput
                                ? "input.mask"
                                : "keyup.mask",
                            c.behaviour
                        )
                        .on("paste.mask drop.mask", function () {
                            setTimeout(function () {
                                b.keydown().keyup();
                            }, 100);
                        })
                        .on("change.mask", function () {
                            b.data("changed", !0);
                        })
                        .on("blur.mask", function () {
                            f === c.val() ||
                                b.data("changed") ||
                                b.trigger("change");
                            b.data("changed", !1);
                        })
                        .on("blur.mask", function () {
                            f = c.val();
                        })
                        .on("focus.mask", function (b) {
                            !0 === e.selectOnFocus && a(b.target).select();
                        })
                        .on("focusout.mask", function () {
                            e.clearIfNotMatch && !k.test(c.val()) && c.val("");
                        });
                },
                getRegexMask: function () {
                    for (var a = [], b, c, e, t, f = 0; f < d.length; f++)
                        (b = l.translation[d.charAt(f)])
                            ? ((c = b.pattern
                                  .toString()
                                  .replace(/.{1}$|^.{1}/g, "")),
                              (e = b.optional),
                              (b = b.recursive)
                                  ? (a.push(d.charAt(f)),
                                    (t = { digit: d.charAt(f), pattern: c }))
                                  : a.push(e || b ? c + "?" : c))
                            : a.push(
                                  d
                                      .charAt(f)
                                      .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                              );
                    a = a.join("");
                    t &&
                        (a = a
                            .replace(
                                new RegExp(
                                    "(" + t.digit + "(.*" + t.digit + ")?)"
                                ),
                                "($1)?"
                            )
                            .replace(new RegExp(t.digit, "g"), t.pattern));
                    return new RegExp(a);
                },
                destroyEvents: function () {
                    b.off(
                        "input keydown keyup paste drop blur focusout "
                            .split(" ")
                            .join(".mask ")
                    );
                },
                val: function (a) {
                    var c = b.is("input") ? "val" : "text";
                    if (0 < arguments.length) {
                        if (b[c]() !== a) b[c](a);
                        c = b;
                    } else c = b[c]();
                    return c;
                },
                calculateCaretPosition: function (a) {
                    var d = c.getMasked(),
                        h = c.getCaret();
                    if (a !== d) {
                        var e = b.data("mask-previus-caret-pos") || 0;
                        d = d.length;
                        var g = a.length,
                            f = (a = 0),
                            l = 0,
                            k = 0,
                            m;
                        for (m = h; m < d && c.maskDigitPosMap[m]; m++) f++;
                        for (m = h - 1; 0 <= m && c.maskDigitPosMap[m]; m--)
                            a++;
                        for (m = h - 1; 0 <= m; m--)
                            c.maskDigitPosMap[m] && l++;
                        for (m = e - 1; 0 <= m; m--)
                            c.maskDigitPosMapOld[m] && k++;
                        h > g
                            ? (h = 10 * d)
                            : e >= h && e !== g
                            ? c.maskDigitPosMapOld[h] ||
                              ((e = h),
                              (h = h - (k - l) - a),
                              c.maskDigitPosMap[h] && (h = e))
                            : h > e && (h = h + (l - k) + f);
                    }
                    return h;
                },
                behaviour: function (d) {
                    d = d || window.event;
                    c.invalid = [];
                    var e = b.data("mask-keycode");
                    if (-1 === a.inArray(e, l.byPassKeys)) {
                        e = c.getMasked();
                        var h = c.getCaret(),
                            g = b.data("mask-previus-value") || "";
                        setTimeout(function () {
                            c.setCaret(c.calculateCaretPosition(g));
                        }, a.jMaskGlobals.keyStrokeCompensation);
                        c.val(e);
                        c.setCaret(h);
                        return c.callbacks(d);
                    }
                },
                getMasked: function (a, b) {
                    var h = [],
                        f = void 0 === b ? c.val() : b + "",
                        g = 0,
                        k = d.length,
                        n = 0,
                        p = f.length,
                        m = 1,
                        r = "push",
                        u = -1,
                        w = 0;
                    b = [];
                    if (e.reverse) {
                        r = "unshift";
                        m = -1;
                        var x = 0;
                        g = k - 1;
                        n = p - 1;
                        var A = function () {
                            return -1 < g && -1 < n;
                        };
                    } else
                        (x = k - 1),
                            (A = function () {
                                return g < k && n < p;
                            });
                    for (var z; A(); ) {
                        var y = d.charAt(g),
                            v = f.charAt(n),
                            q = l.translation[y];
                        if (q)
                            v.match(q.pattern)
                                ? (h[r](v),
                                  q.recursive &&
                                      (-1 === u
                                          ? (u = g)
                                          : g === x && g !== u && (g = u - m),
                                      x === u && (g -= m)),
                                  (g += m))
                                : v === z
                                ? (w--, (z = void 0))
                                : q.optional
                                ? ((g += m), (n -= m))
                                : q.fallback
                                ? (h[r](q.fallback), (g += m), (n -= m))
                                : c.invalid.push({ p: n, v: v, e: q.pattern }),
                                (n += m);
                        else {
                            if (!a) h[r](y);
                            v === y
                                ? (b.push(n), (n += m))
                                : ((z = y), b.push(n + w), w++);
                            g += m;
                        }
                    }
                    a = d.charAt(x);
                    k !== p + 1 || l.translation[a] || h.push(a);
                    h = h.join("");
                    c.mapMaskdigitPositions(h, b, p);
                    return h;
                },
                mapMaskdigitPositions: function (a, b, d) {
                    a = e.reverse ? a.length - d : 0;
                    c.maskDigitPosMap = {};
                    for (d = 0; d < b.length; d++)
                        c.maskDigitPosMap[b[d] + a] = 1;
                },
                callbacks: function (a) {
                    var g = c.val(),
                        h = g !== f,
                        k = [g, a, b, e],
                        l = function (a, b, c) {
                            "function" === typeof e[a] &&
                                b &&
                                e[a].apply(this, c);
                        };
                    l("onChange", !0 === h, k);
                    l("onKeyPress", !0 === h, k);
                    l("onComplete", g.length === d.length, k);
                    l("onInvalid", 0 < c.invalid.length, [
                        g,
                        a,
                        b,
                        c.invalid,
                        e,
                    ]);
                },
            };
            b = a(b);
            var l = this,
                f = c.val(),
                k;
            d = "function" === typeof d ? d(c.val(), void 0, b, e) : d;
            l.mask = d;
            l.options = e;
            l.remove = function () {
                var a = c.getCaret();
                l.options.placeholder && b.removeAttr("placeholder");
                b.data("mask-maxlength") && b.removeAttr("maxlength");
                c.destroyEvents();
                c.val(l.getCleanVal());
                c.setCaret(a);
                return b;
            };
            l.getCleanVal = function () {
                return c.getMasked(!0);
            };
            l.getMaskedVal = function (a) {
                return c.getMasked(!1, a);
            };
            l.init = function (g) {
                g = g || !1;
                e = e || {};
                l.clearIfNotMatch = a.jMaskGlobals.clearIfNotMatch;
                l.byPassKeys = a.jMaskGlobals.byPassKeys;
                l.translation = a.extend(
                    {},
                    a.jMaskGlobals.translation,
                    e.translation
                );
                l = a.extend(!0, {}, l, e);
                k = c.getRegexMask();
                if (g) c.events(), c.val(c.getMasked());
                else {
                    e.placeholder && b.attr("placeholder", e.placeholder);
                    b.data("mask") && b.attr("autocomplete", "off");
                    g = 0;
                    for (var f = !0; g < d.length; g++) {
                        var h = l.translation[d.charAt(g)];
                        if (h && h.recursive) {
                            f = !1;
                            break;
                        }
                    }
                    f &&
                        b
                            .attr("maxlength", d.length)
                            .data("mask-maxlength", !0);
                    c.destroyEvents();
                    c.events();
                    g = c.getCaret();
                    c.val(c.getMasked());
                    c.setCaret(g);
                }
            };
            l.init(!b.is("input"));
        };
        a.maskWatchers = {};
        var f = function () {
                var b = a(this),
                    d = {},
                    e = b.attr("data-mask");
                b.attr("data-mask-reverse") && (d.reverse = !0);
                b.attr("data-mask-clearifnotmatch") && (d.clearIfNotMatch = !0);
                "true" === b.attr("data-mask-selectonfocus") &&
                    (d.selectOnFocus = !0);
                if (p(b, e, d)) return b.data("mask", new n(this, e, d));
            },
            p = function (b, d, e) {
                e = e || {};
                var c = a(b).data("mask"),
                    f = JSON.stringify;
                b = a(b).val() || a(b).text();
                try {
                    return (
                        "function" === typeof d && (d = d(b)),
                        "object" !== typeof c ||
                            f(c.options) !== f(e) ||
                            c.mask !== d
                    );
                } catch (w) {}
            },
            k = function (a) {
                var b = document.createElement("div");
                a = "on" + a;
                var e = a in b;
                e ||
                    (b.setAttribute(a, "return;"),
                    (e = "function" === typeof b[a]));
                return e;
            };
        a.fn.mask = function (b, d) {
            d = d || {};
            var e = this.selector,
                c = a.jMaskGlobals,
                f = c.watchInterval;
            c = d.watchInputs || c.watchInputs;
            var k = function () {
                if (p(this, b, d))
                    return a(this).data("mask", new n(this, b, d));
            };
            a(this).each(k);
            e &&
                "" !== e &&
                c &&
                (clearInterval(a.maskWatchers[e]),
                (a.maskWatchers[e] = setInterval(function () {
                    a(document).find(e).each(k);
                }, f)));
            return this;
        };
        a.fn.masked = function (a) {
            return this.data("mask").getMaskedVal(a);
        };
        a.fn.unmask = function () {
            clearInterval(a.maskWatchers[this.selector]);
            delete a.maskWatchers[this.selector];
            return this.each(function () {
                var b = a(this).data("mask");
                b && b.remove().removeData("mask");
            });
        };
        a.fn.cleanVal = function () {
            return this.data("mask").getCleanVal();
        };
        a.applyDataMask = function (b) {
            b = b || a.jMaskGlobals.maskElements;
            (b instanceof a ? b : a(b))
                .filter(a.jMaskGlobals.dataMaskAttr)
                .each(f);
        };
        k = {
            maskElements: "input,td,span,div",
            dataMaskAttr: "*[data-mask]",
            dataMask: !0,
            watchInterval: 300,
            watchInputs: !0,
            keyStrokeCompensation: 10,
            useInput:
                !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(
                    window.navigator.userAgent
                ) && k("input"),
            watchDataMask: !1,
            byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
            translation: {
                0: { pattern: /\d/ },
                9: { pattern: /\d/, optional: !0 },
                "#": { pattern: /\d/, recursive: !0 },
                A: { pattern: /[a-zA-Z0-9]/ },
                S: { pattern: /[a-zA-Z]/ },
            },
        };
        a.jMaskGlobals = a.jMaskGlobals || {};
        k = a.jMaskGlobals = a.extend(!0, {}, k, a.jMaskGlobals);
        k.dataMask && a.applyDataMask();
        setInterval(function () {
            a.jMaskGlobals.watchDataMask && a.applyDataMask();
        }, k.watchInterval);
    },
    window.jQuery,
    window.Zepto
);


/***/ }),

/***/ "./src/arquivos/js/services/ServiceExemple.js":
/*!****************************************************!*\
  !*** ./src/arquivos/js/services/ServiceExemple.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ServiceExemple; }
/* harmony export */ });
class ServiceExemple {
    //esse eh um exemplo de service
    //essa rota, eh um exemplo de rota declarada dentro do service node
    //os services servem para consumir apis e apis privadas
    async getAllInfoClient(id) {
        const data = await fetch(
            `/clientapi/getInfoClient/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        return data.json();
    }
}

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
/*!*************************************!*\
  !*** ./src/arquivos/js/checkout.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'regenerator-runtime'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Exemple.js */ "./src/arquivos/js/components/Exemple.js");
/* harmony import */ var _components_CodeSeller_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/CodeSeller.js */ "./src/arquivos/js/components/CodeSeller.js");
/* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/jquery.mask.min.js */ "./src/arquivos/js/lib/jquery.mask.min.js");
/* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_priceMeterPromotion_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/priceMeterPromotion.js */ "./src/arquivos/js/components/priceMeterPromotion.js");






class Checkout {
    constructor() {
        this.init();
    }

    init() {
        new _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
        new _components_CodeSeller_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
        new _components_priceMeterPromotion_js__WEBPACK_IMPORTED_MODULE_4__["default"]();
        // new WarehouseValidation();
        // new SalesmanCode();
    }
}

new Checkout();

(function () {
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "//suite.linximpulse.net/impulse/impulse.js";
    script.setAttribute("data-apikey", "padovani");
    document.head.appendChild(script);
})();

console.log('custom checkout 1.0.3 paymee');  
!function(t,e,i){
    var r=t.createElement("script"),
    s=t.getElementsByTagName("body")[0];
    r.type="text/javascript",
    r.src="https://pppvtex.paymee.com.br/paymee.parcelado.vtex.js?"+new Date().getMilliseconds(),
    r.id="paymeeInstallment",s.appendChild(r);
}(document);
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyZWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLEdBQUc7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbEJBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxlQUFlLDRCQUE0QjtXQUMzQyxlQUFlO1dBQ2YsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BELDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFDaUI7QUFDTTtBQUNsQjtBQUNvQztBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksOERBQU87QUFDbkIsWUFBWSxpRUFBVTtBQUN0QixZQUFZLDBFQUFtQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLFciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9jb21wb25lbnRzL0NvZGVTZWxsZXIuanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvY29tcG9uZW50cy9FeGVtcGxlLmpzIiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL2NvbXBvbmVudHMvcHJpY2VNZXRlclByb21vdGlvbi5qcyIsIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9oZWxwZXJzL3dhaXRGb3JFbC5qcyIsIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9saWIvanF1ZXJ5Lm1hc2subWluLmpzIiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL3NlcnZpY2VzL1NlcnZpY2VFeGVtcGxlLmpzIiwid2VicGFjazovL2NoZWNrb3V0L2V4dGVybmFsIHZhciBcImpRdWVyeVwiIiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9jaGVja291dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlU2VsbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaWREb2N1bWVudCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5kZWJvdW5jZVRpbWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc1ZlbmRvckRpc3BsYXllZCA9IGZhbHNlOyAvLyBGbGFnIHBhcmEgZ2FyYW50aXIgcXVlIG8gdmVuZGVkb3Igc2VqYSBleGliaWRvIHVtYSB2ZXpcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbkNvbnRlbnRNYXJrZXRpbmdEYXRhKClcclxuICAgICAgICB0aGlzLmxvYWRTYXZlZENvdXBvbigpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ291cG9uKCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJbnB1dENoYW5nZSgpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9ICQoXCJidXR0b24jc2FsZXNtYW5jb2RlLXJlbW92ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghYnV0dG9uLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvdXBvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGlvbkNvbnRlbnRNYXJrZXRpbmdEYXRhKCkge1xyXG4gICAgICAgIGZldGNoKGAvYXBpL2NoZWNrb3V0L3B1Yi9vcmRlckZvcm1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKS50aGVuKChvcmRlckZvcm0pID0+IHtcclxuICAgICAgICAgICAgaWYgKG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhPy51dG1pQ2FtcGFpZ24pIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oYXNWZW5kb3JEaXNwbGF5ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdFZlbmRvckRhdGEob3JkZXJGb3JtLm1hcmtldGluZ0RhdGEudXRtaUNhbXBhaWduKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXN1bHRWZW5kb3JEYXRhKGNvZCkge1xyXG4gICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICB1cmw6IGAvY3VzdG9tcmVxdWVzdC9nZXR2ZW5kb3Jjb2RlLyR7Y29kfWAsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93VmVuZG9ySW5mbyhyZXNwb25zZVswXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tcmVzdWx0XCIpLmh0bWwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5Dw7NkaWdvIGRlIFZlbmRlZG9yIGludsOhbGlkbyE8L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm8pO1xyXG4gICAgICAgICAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVycm9yXCI+RXJybyBuYSBidXNjYSBkbyBjw7NkaWdvIGRvIHZlbmRlZG9yPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93VmVuZG9ySW5mbyh2ZW5kb3JEYXRhKSB7XHJcbiAgICAgICAgLy8gVmVyaWZpY2Egc2UgasOhIGZvaSBleGliaWRvIHBhcmEgZXZpdGFyIHJlcGV0acOnw6NvXHJcbiAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHR0XCIpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNhbGVzbWFuLXJlc3VsdHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaG93LXNhbGVzbWFuY29kZVwiPlZlbmRlZG9yOiAke3ZlbmRvckRhdGEuY29kaWdvdmVuZGVkb3J9IC0gJHt2ZW5kb3JEYXRhLm5vbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2FsZXNtYW5jb2RlLXJlbW92ZVwiIGNsYXNzPVwiY2FydC1zYWxlc21hbmNvZGUtcmVtb3ZlXCI+UmVtb3ZlcjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICB0aGlzLndhaXRGb3JFbChcIi5mb3Jtcy5jb3Vwb24tY29sdW1uLnN1bW1hcnktY291cG9uLXdyYXBcIilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChcIi5mb3Jtcy5jb3Vwb24tY29sdW1uLnN1bW1hcnktY291cG9uLXdyYXBcIikucHJlcGVuZChodG1sKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFzVmVuZG9yRGlzcGxheWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ291cG9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTYXZlZENvdXBvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG5cclxuICAgICAgICB2dGV4anMuY2hlY2tvdXQuc2V0Q3VzdG9tRGF0YSh7IGFwcDogJ2NvZGlnb3ZlbmRlZG9yJywgZmllbGQ6ICdjb2RpZ29WZW5kZWRvcicsIHZhbHVlOiBgJHt2ZW5kb3JEYXRhLmNvZGlnb3ZlbmRlZG9yfWAgfSk7XHJcblxyXG4gICAgICAgIHZ0ZXhqcy5jaGVja291dC5nZXRPcmRlckZvcm0oKS50aGVuKGZ1bmN0aW9uIChvcmRlckZvcm0pIHtcclxuICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xyXG4gICAgICAgICAgICBtYXJrZXRpbmdEYXRhLnV0bWlDYW1wYWlnbiA9IGAke3ZlbmRvckRhdGEuY29kaWdvdmVuZGVkb3J9YDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG9yZGVyRm9ybSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlckZvcm0ubWFya2V0aW5nRGF0YSwgXCJtYXJrZXRpbmdEYXRhIGF0dWFsaXphZG9cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlQ291cG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkSW5wdXQoKSB7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoJChcIi5zYWxlc21hbi1jb3Vwb25cIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBodG1sID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxlc21hbi1jb3Vwb24gbmV3LWNvZGUtc2FsZXNtYW5cIj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGUtc2FsZXNtYW4tY291cG9uXCI+Q8OzZGlnbyBkbyBWZW5kZWRvcjwvc3Bhbj5cclxuICAgICAgICAgIDxmb3JtIGNsYXNzPVwic2FsZXNtYW4tY291cG9uLWZvcm1cIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFc2NyZXZhIG8gQ8OzZGlnbyBkbyBWZW5kZWRvclwiIG5hbWU9XCJjb2RpZ292ZW5kZWRvclwiIGlkPVwiY29kaWdvdmVuZGVkb3JcIiAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvdXBvbi1zZW5kXCI+QXBsaWNhcjwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNhbGVzbWFuLXJlc3VsdFwiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICBgO1xyXG5cclxuICAgICAgICBfdGhpc1xyXG4gICAgICAgICAgICAud2FpdEZvckVsKFwiLmZvcm1zLmNvdXBvbi1jb2x1bW4uc3VtbWFyeS1jb3Vwb24td3JhcFwiKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmZvcm1zLmNvdXBvbi1jb2x1bW4uc3VtbWFyeS1jb3Vwb24td3JhcFwiKS5wcmVwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG9hZFNhdmVkQ291cG9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJbnB1dENoYW5nZSgpIHtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwiaW5wdXRcIiwgXCIjY29kaWdvdmVuZGVkb3JcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5kZWJvdW5jZVRpbWVyKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoX3RoaXMuZGVib3VuY2VUaW1lcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF90aGlzLmRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZmV0Y2hWZW5kb3JEYXRhKGlucHV0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLnNhbGVzbWFuLXJlc3VsdFwiKS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoVmVuZG9yRGF0YShjb2QpIHtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgdXJsOiBgL2N1c3RvbXJlcXVlc3QvZ2V0dmVuZG9yY29kZS8ke2NvZH1gLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd1ZlbmRvckRhdGEocmVzcG9uc2VbMF0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLnNhbGVzbWFuLXJlc3VsdFwiKS5odG1sKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVycm9yXCI+Q8OzZGlnbyBkZSBWZW5kZWRvciBpbnbDoWxpZG8hPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJybykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvKTtcclxuICAgICAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tcmVzdWx0XCIpLmh0bWwoXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlcnJvclwiPkVycm8gbmEgYnVzY2EgZG8gY8OzZGlnbyBkbyB2ZW5kZWRvcjwvZGl2PidcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1ZlbmRvckRhdGEodmVuZG9yRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGh0bWwgPSBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNob3ctc2FsZXNtYW5jb2RlXCI+XHJcbiAgICAgICAgICAgIFZlbmRlZG9yOiAke3ZlbmRvckRhdGEuY29kaWdvdmVuZGVkb3J9IC0gJHt2ZW5kb3JEYXRhLm5vbWV9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICAkKFwiLnNhbGVzbWFuLXJlc3VsdFwiKS5odG1sKGh0bWwpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBoYW5kbGVDb3Vwb24oKSB7XHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcInN1Ym1pdFwiLCBcImZvcm0uc2FsZXNtYW4tY291cG9uLWZvcm1cIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvZCA9ICQodGhpcykuZmluZChcIiNjb2RpZ292ZW5kZWRvclwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGAvY3VzdG9tcmVxdWVzdC9nZXR2ZW5kb3Jjb2RlLyR7Y29kfWAsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pZERvY3VtZW50ID0gcmVzcG9uc2VbMF0uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluZm9WZW5kZWRvcihfdGhpcy5pZERvY3VtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5zYWxlc21hbi1jb3Vwb24tZm9ybVwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIudGl0bGUtc2FsZXNtYW4tY291cG9uXCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ8OzZGlnbyBkZSBWZW5kZWRvciBpbnbDoWxpZG8hIFRlbnRlIG91dHJvIGPDs2RpZ29cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm8pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5mb1ZlbmRlZG9yKGlkRG9jdW1lbnQpIHtcclxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgdXJsOiBgL2N1c3RvbXJlcXVlc3QvZ2V0dmVuZG9yZGF0YS8ke2lkRG9jdW1lbnR9YCxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29udGVudFZhbGlkQ291cG9uKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zYXZlQ291cG9uVG9Mb2NhbFN0b3JhZ2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkPDs2RpZ28gZGUgVmVuZGVkb3IgaW52w6FsaWRvISBUZW50ZSBvdXRybyBjw7NkaWdvXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm8pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJybyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGVudFZhbGlkQ291cG9uKGNvbnRlbnQpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy52dGV4anMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gIFxyXG4gICAgICAgIGNvbnN0IGh0bWwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaG93LXNhbGVzbWFuY29kZVwiPlxyXG4gICAgICAgICAgICAgICAgVmVuZGVkb3I6ICR7Y29udGVudC5jb2RpZ292ZW5kZWRvcn0gLSAke2NvbnRlbnQubm9tZX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYWxlc21hbmNvZGUtcmVtb3ZlXCIgY2xhc3M9XCJjYXJ0LXNhbGVzbWFuY29kZS1yZW1vdmVcIj5cclxuICAgICAgICAgICAgICAgIFJlbW92ZXJcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdnRleGpzPy5jaGVja291dD8uc2V0Q3VzdG9tRGF0YSh7IGFwcDogJ2NvZGlnb3ZlbmRlZG9yJywgZmllbGQ6ICdjb2RpZ29WZW5kZWRvcicsIHZhbHVlOiBgJHtjb250ZW50LmNvZGlnb3ZlbmRlZG9yfWAgfSk7XHJcblxyXG4gICAgICAgIHZ0ZXhqcy5jaGVja291dC5nZXRPcmRlckZvcm0oKS50aGVuKGZ1bmN0aW9uIChvcmRlckZvcm0pIHtcclxuICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xyXG4gICAgICAgICAgICBtYXJrZXRpbmdEYXRhLnV0bWlDYW1wYWlnbiA9IGAke2NvbnRlbnQuY29kaWdvdmVuZGVkb3J9YDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKG9yZGVyRm9ybSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlckZvcm0ubWFya2V0aW5nRGF0YSwgXCJtYXJrZXRpbmdEYXRhIGF0dWFsaXphZG9cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF90aGlzLnJlbW92ZUNvdXBvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvdXBvbigpIHtcclxuICAgICAgICAkKFwiYnV0dG9uI3NhbGVzbWFuY29kZS1yZW1vdmVcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgICQoXCJidXR0b24jc2FsZXNtYW5jb2RlLXJlbW92ZVwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgJChcIi5zaG93LXNhbGVzbWFuY29kZSwgLmNhcnQtc2FsZXNtYW5jb2RlLXJlbW92ZVwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tY291cG9uLWZvcm1cIikuc2hvdygpO1xyXG4gICAgICAgICAgICAkKFwiLnRpdGxlLXNhbGVzbWFuLWNvdXBvblwiKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInNhbGVzbWFuRGF0YVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmZXRjaChcclxuICAgICAgICAgICAgICAgIGAvYXBpL2NoZWNrb3V0L3B1Yi9vcmRlckZvcm0vJHt2dGV4anM/LmNoZWNrb3V0Py5vcmRlckZvcm1JZH0vY3VzdG9tRGF0YS9jb2RpZ292ZW5kZWRvci9jb2RpZ29WZW5kZWRvcmAsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJybyBhbyByZW1vdmVyIGN1c3RvbURhdGE6XCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdnRleGpzLmNoZWNrb3V0LmdldE9yZGVyRm9ybSgpLnRoZW4oZnVuY3Rpb24gKG9yZGVyRm9ybSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xyXG4gICAgICAgICAgICAgICAgbWFya2V0aW5nRGF0YS51dG1pQ2FtcGFpZ24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xyXG4gICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChvcmRlckZvcm0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhLCBcIkPDs2RpZ28gZGUgdmVuZGVkb3IgcmVtb3ZpZG9cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVDb3Vwb25Ub0xvY2FsU3RvcmFnZShjb250ZW50KSB7XHJcbiAgICAgICAgY29uc3Qgc2FsZXNtYW5EYXRhID0ge1xyXG4gICAgICAgICAgICBjb2RpZ292ZW5kZWRvcjogY29udGVudC5jb2RpZ292ZW5kZWRvcixcclxuICAgICAgICAgICAgbm9tZTogY29udGVudC5ub21lLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYWxlc21hbkRhdGFcIiwgSlNPTi5zdHJpbmdpZnkoc2FsZXNtYW5EYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFNhdmVkQ291cG9uKCkge1xyXG4gICAgICAgIGlmICghd2luZG93LnZ0ZXhqcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmVkRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2FsZXNtYW5EYXRhXCIpO1xyXG5cclxuICAgICAgICBpZiAoc2F2ZWREYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKHNhdmVkRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gYFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNob3ctc2FsZXNtYW5jb2RlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgVmVuZGVkb3I6ICR7Y29udGVudC5jb2RpZ292ZW5kZWRvcn0gLSAke2NvbnRlbnQubm9tZX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhbGVzbWFuY29kZS1yZW1vdmVcIiBjbGFzcz1cImNhcnQtc2FsZXNtYW5jb2RlLXJlbW92ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIFJlbW92ZXJcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPmA7XHJcblxyXG4gICAgICAgICAgICAkKFwiLnNhbGVzbWFuLXJlc3VsdFwiKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAkKFwiLnNhbGVzbWFuLWNvdXBvbi1mb3JtXCIpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdhaXRGb3JFbChzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCQoc2VsZWN0b3IpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgkKHNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHdhaXRGb3JFbCBmcm9tIFwiLi4vaGVscGVycy93YWl0Rm9yRWxcIjtcclxuaW1wb3J0IFNlcnZpY2VFeGVtcGxlIGZyb20gXCIuLi9zZXJ2aWNlcy9TZXJ2aWNlRXhlbXBsZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhlbXBsZSB7XHJcbiAgICBzZXJ2aWNlRXhlbXBsZSA9IG5ldyBTZXJ2aWNlRXhlbXBsZSgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0b3JzKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RvcnMoKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9ICQoXCIuZXhhbXBsZS10aXRsZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBldmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZS5jbGljayh0aGlzLmV4ZW1wbGVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PSBcIiMvc2hpcHBpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgd2FpdEZvckVsKFwiI3NoaXAtY29tcGxlbWVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZXZlbG9wXHJcbiAgICAgICAgICAgICAgICAgICAgKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiIy9jYXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgIHdhaXRGb3JFbChcIi5zdW1tYXJ5LWNhcnQtdGVtcGxhdGUtaG9sZGVyIC5ocHJvZHVjdCAucGhvdG9cIilcclxuICAgICAgICAgICAgICAgICAgICAudGhlblxyXG4gICAgICAgICAgICAgICAgICAgIC8vZGV2ZWxvcFxyXG4gICAgICAgICAgICAgICAgICAgICgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbihcIm9yZGVyRm9ybVVwZGF0ZWQudnRleFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9yZGVyRm9ybURhdGEgPSB2dGV4anMuY2hlY2tvdXQub3JkZXJGb3JtO1xyXG4gICAgICAgICAgICBsZXQgcG9zdGFsQ29kZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBvcmRlckZvcm1EYXRhLnNoaXBwaW5nRGF0YSAmJlxyXG4gICAgICAgICAgICAgICAgb3JkZXJGb3JtRGF0YS5zaGlwcGluZ0RhdGEuYWRkcmVzcyAmJlxyXG4gICAgICAgICAgICAgICAgb3JkZXJGb3JtRGF0YS5zaGlwcGluZ0RhdGEuYWRkcmVzcy5wb3N0YWxDb2RlXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcG9zdGFsQ29kZSA9IG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhLmFkZHJlc3MucG9zdGFsQ29kZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhICYmXHJcbiAgICAgICAgICAgICAgICBvcmRlckZvcm1EYXRhLnNoaXBwaW5nRGF0YS5hdmFpbGFibGVBZGRyZXNzZXMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHBvc3RhbENvZGUgPVxyXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhLmF2YWlsYWJsZUFkZHJlc3Nlc1swXS5wb3N0YWxDb2RlOyAvLyBBc3N1bWUgcXVlIG8gcHJpbWVpcm8gZW5kZXJlw6dvIGRpc3BvbsOtdmVsIMOpIG8gcHJpbmNpcGFsXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghcG9zdGFsQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICAgICAgICAgICAgICBcIlBvc3RhbCBDb2RlIG7Do28gZGlzcG9uw612ZWwuIFJlcXVpc2nDp8OjbyBuw6NvIHNlcsOhIGZlaXRhLlwiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcmRlckZvcm1EYXRhLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBpdGVtLnF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGxlcjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZldGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiL2FwaS9jaGVja291dC9wdWIvb3JkZXJGb3Jtcy9zaW11bGF0aW9uP1JuYkJlaGF2aW9yPTAmc2M9MSZpbmRpdmlkdWFsU2hpcHBpbmdFc3RpbWF0ZXM9dHJ1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW2l0ZW1EYXRhXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhbENvZGU6IHBvc3RhbENvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudHJ5OiBcIkJSQVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRPcmRlckZvcm1TZWN0aW9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvdGFsaXplcnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNoaXBwaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGRhdGFSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhUmVzcG9uc2UsIFwiZGF0YVJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3BvbnNlLmxvZ2lzdGljc0luZm8gJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFSZXNwb25zZS5sb2dpc3RpY3NJbmZvLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwcGluZ0VzdGltYXRlcyA9IGRhdGFSZXNwb25zZS5sb2dpc3RpY3NJbmZvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChsb2dpc3RpY3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2xhID0gbG9naXN0aWNzLnNsYXMuZmluZCgoc2xhKSA9PiBzbGEuaWQgPT09IFwiU0VERVhcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xhID0gbG9naXN0aWNzLnNsYXMuZmluZCgoc2xhKSA9PiBzbGEuaWQgPT09IFwiTm9ybWFsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2xhID8gc2xhLnNoaXBwaW5nRXN0aW1hdGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoaXBwaW5nRXN0aW1hdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2hpcHBpbmdFc3RpbWF0ZSA9IHNoaXBwaW5nRXN0aW1hdGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNoaXBwaW5nRXN0aW1hdGUsIFwic2hpcHBpbmdFc3RpbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcHBpbmdFc3RpbWF0ZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBwaW5nRXN0aW1hdGUubWF0Y2goL1xcZCsvKVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhJChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAucHJvZHVjdC1pdGVtW2RhdGEtc2t1PSR7aXRlbS5pZH1dIC5zaGlwcGluZy1kYXRlIC5zaGlwcGluZy1lc3RpbWF0ZS1kYXRlYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmZpbmQoYC5jdXN0b20tbWVzc2FnZS0ke2l0ZW0uaWR9YCkubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBwaW5nTWVzc2FnZSA9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9J2N1c3RvbS1tZXNzYWdlLWluZm8gY3VzdG9tLW1lc3NhZ2UtJHtpdGVtLmlkfSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbSBhdMOpICR7c2hpcHBpbmdFc3RpbWF0ZX0gZGlhcyDDunRlaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYC5wcm9kdWN0LWl0ZW1bZGF0YS1za3U9JHtpdGVtLmlkfV0gLnNoaXBwaW5nLWRhdGUgLnNoaXBwaW5nLWVzdGltYXRlLWRhdGVgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuYXBwZW5kKHNoaXBwaW5nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgTmVuaHVtIFNMQSBjb20gaWQgJ1NFREVYJyBlbmNvbnRyYWRvIHBhcmEgbyBpdGVtICR7aXRlbS5pZH0uYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBOZW5odW1hIGluZm9ybWHDp8OjbyBkZSBsb2dpc3RpY3NJbmZvIGVuY29udHJhZGEgcGFyYSBvIGl0ZW0gJHtpdGVtLmlkfS5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbGFFbGVtZW50cyA9ICQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5zcnAtc2hpcHBpbmctY3VycmVudC1zaW5nbGVfX3NsYS5ncmF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRGb3JFbChzbGFFbGVtZW50cykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGFFbGVtZW50cy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbGFUZXh0ID0gJCh0aGlzKS50ZXh0KCkudHJpbSgpOyBcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGFUZXh0LmluY2x1ZGVzKFwiUHJvbnRvIGVtIGF0w6lcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jdXN0b20tbWVzc2FnZS1pbmZvXCIpLmhpZGUoKTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwcGluZ0VzdGltYXRlRGF0ZUVsZW1lbnQgPSAkKFwiLnNoaXBwaW5nLWVzdGltYXRlLWRhdGVcIilcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpcHBpbmdFc3RpbWF0ZURhdGVFbGVtZW50Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcHBpbmdFc3RpbWF0ZURhdGVFbGVtZW50LmFkZENsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWN0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvIHBhcmEgbyBpdGVtICR7aXRlbS5pZH06YCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwib3JkZXJGb3JtVXBkYXRlZC52dGV4XCIsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiIy9jYXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgIHdhaXRGb3JFbChcIi5ocHJvZHVjdCAucGhvdG9cIikudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leGVtcGxlTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4ZW1wbGVFdmVudChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4ZW1wbGVNZXRob2QoKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZS5hZGRDbGFzcyhcInRlc3RlXCIpO1xyXG4gICAgICAgIHRoaXMuc2VydmljZUV4ZW1wbGUuZ2V0QWxsSW5mb0NsaWVudCgxKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBwcmljZU1ldGVyUHJvbW90aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XHJcbiAgICAgICQod2luZG93KS5vbihcIm9yZGVyRm9ybVVwZGF0ZWQudnRleFwiLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUHJpY2VNZXRlclByb21vdGlvbigpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQod2luZG93KS5vbihcImhhc2hjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvblByaWNlTWV0ZXJQcm9tb3Rpb24oKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRpb25QcmljZU1ldGVyUHJvbW90aW9uKCkge1xyXG4gICAgdGhpcy53YWl0Rm9yRWwoXCIubmV3LXByb2R1Y3QtcmVhbC1wcmljZS1wZXItdW5pdFwiKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcmljZU1ldGVyUHJvbW90aW9uKCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJybyBhbyBlc3BlcmFyIHBlbG8gZWxlbWVudG86XCIsIGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcmljZU1ldGVyUHJvbW90aW9uKCkge1xyXG4gICAgY29uc3Qgb3JkZXJGb3JtID0gdnRleGpzLmNoZWNrb3V0Lm9yZGVyRm9ybTtcclxuXHJcbiAgICBjb25zdCBkaXNjb3VudERhdGEgPSBvcmRlckZvcm0ucmF0ZXNBbmRCZW5lZml0c0RhdGEucmF0ZUFuZEJlbmVmaXRzSWRlbnRpZmllcnMuZmluZCgoaWRlbnRpZmllcikgPT4ge1xyXG4gICAgICByZXR1cm4gaWRlbnRpZmllci5uYW1lICYmIC9cXGQrJS8udGVzdChpZGVudGlmaWVyLm5hbWUpOyAvLyBJZGVudGlmaWNhIGRlc2NvbnRvcyBwb3IgcG9yY2VudGFnZW1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghZGlzY291bnREYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIk5lbmh1bSBjdXBvbSBjb20gZGVzY29udG8gZm9pIGVuY29udHJhZG8gbm8gb3JkZXJGb3JtLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc2NvdW50TWF0Y2ggPSBkaXNjb3VudERhdGEubmFtZS5tYXRjaCgvKFxcZCspJS8pO1xyXG4gICAgY29uc3QgZGlzY291bnRQZXJjZW50YWdlID0gZGlzY291bnRNYXRjaCA/IHBhcnNlSW50KGRpc2NvdW50TWF0Y2hbMV0sIDEwKSA6IDA7XHJcblxyXG4gICAgaWYgKGRpc2NvdW50UGVyY2VudGFnZSA+IDApIHtcclxuICAgICAgb3JkZXJGb3JtLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxQcmljZVBlck0yID0gaXRlbS5wcmljZSAvIDEwMDsgXHJcbiAgICAgICAgY29uc3QgZGlzY291bnRlZFByaWNlUGVyTTIgPSBvcmlnaW5hbFByaWNlUGVyTTIgKiAoMSAtIGRpc2NvdW50UGVyY2VudGFnZSAvIDEwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFByaWNlID0gZGlzY291bnRlZFByaWNlUGVyTTIudG9GaXhlZCgyKS5yZXBsYWNlKCcuJywgJywnKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdENvbnRhaW5lciA9ICQoYC5wcm9kdWN0LWl0ZW1gKS5lcShpbmRleCk7IFxyXG5cclxuICAgICAgICBpZiAocHJvZHVjdENvbnRhaW5lci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbFByaWNlRWxlbWVudCA9IHByb2R1Y3RDb250YWluZXIuZmluZCgnLm5ldy1wcm9kdWN0LXJlYWwtcHJpY2UtcGVyLXVuaXQnKS5ub3QoJy5kaXNjb3VudGVkJyk7XHJcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbFByaWNlVGV4dCA9IG9yaWdpbmFsUHJpY2VFbGVtZW50LnRleHQoKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgaWYgKCFvcmlnaW5hbFByaWNlVGV4dCB8fCBpc05hTihwYXJzZUZsb2F0KG9yaWdpbmFsUHJpY2VUZXh0LnJlcGxhY2UoJ1IkJywgJycpLnJlcGxhY2UoJywnLCAnLicpKSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBQcm9kdXRvIFwiJHtpdGVtLm5hbWV9XCIgbsOjbyBwb3NzdWkgdW0gcHJlw6dvIHbDoWxpZG8gcG9yIG3Csi4gSWdub3JhbmRvLmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHByb2R1Y3RDb250YWluZXIuYXR0cignZGF0YS1kaXNjb3VudC1hcHBsaWVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRGVzY29udG8gasOhIGFwbGljYWRvIGFvIGl0ZW0gXCIke2l0ZW0ubmFtZX1cIi4gSWdub3JhbmRvLmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcHJvZHVjdENvbnRhaW5lci5maW5kKCcubmV3LXByb2R1Y3QtcmVhbC1wcmljZS1wZXItdW5pdC5kaXNjb3VudGVkJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgY29uc3QgbmV3UHJpY2VFbGVtZW50ID0gJCgnPHNtYWxsPicsIHtcclxuICAgICAgICAgICAgY2xhc3M6ICduZXctcHJvZHVjdC1yZWFsLXByaWNlLXBlci11bml0IGRpc2NvdW50ZWQnLFxyXG4gICAgICAgICAgICB0ZXh0OiBgUiQgJHtmb3JtYXR0ZWRQcmljZX0gLyBtwrJgLFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgb3JpZ2luYWxQcmljZUVsZW1lbnQuaGlkZSgpO1xyXG5cclxuICAgICAgICAgIHByb2R1Y3RDb250YWluZXIuZmluZCgnLnByb2R1Y3QtcHJpY2UnKS5hcHBlbmQobmV3UHJpY2VFbGVtZW50KTtcclxuXHJcbiAgICAgICAgICBwcm9kdWN0Q29udGFpbmVyLmF0dHIoJ2RhdGEtZGlzY291bnQtYXBwbGllZCcsICd0cnVlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybihgUHJvZHV0byBcIiR7aXRlbS5uYW1lfVwiIG7Do28gZW5jb250cmFkbyBubyBET00uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIk5lbmh1bSBkZXNjb250byBwZXJjZW50dWFsIHbDoWxpZG8gZm9pIGlkZW50aWZpY2Fkby5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3YWl0Rm9yRWwoc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgkKHNlbGVjdG9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xyXG4gICAgICAgIGlmICgkKHNlbGVjdG9yKS5sZW5ndGgpIHtcclxuICAgICAgICAgIHJlc29sdmUoJChzZWxlY3RvcikpO1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcclxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIEVzcGVyYSB1bSBlbGVtZW50byBleGl0aXIgbm8gZG9tIGUgZXhlY3V0YSBvIGNhbGxiYWNrXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBzZWxldG9yIGRvIGVsZW1lbnRvIHF1ZSBkZWplc2EgZXNwZXJhciBwZWxhIGNyaWHDp8Ojb1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBGdW7Dp8OjbyBhIHNlciBleGVjdXRhZGEgcXVhbmRvIHRhbCBlbGVtZW50byBleGlzdGlyXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2FpdEZvckVsKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBmdW5jdGlvbiB3YWl0Rm9yRWxDYihzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0galF1ZXJ5KHMpO1xyXG4gICAgICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGVsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhaXRGb3JFbENiKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2FpdEZvckVsQ2Ioc2VsZWN0b3IpO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uZC1hc3NpZ24gKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cclxuLy8galF1ZXJ5IE1hc2sgUGx1Z2luIHYxLjE0LjE2XHJcbi8vIGdpdGh1Yi5jb20vaWdvcmVzY29iYXIvalF1ZXJ5LU1hc2stUGx1Z2luXHJcbnZhciAkanNjb21wID0gJGpzY29tcCB8fCB7fTtcclxuJGpzY29tcC5zY29wZSA9IHt9O1xyXG4kanNjb21wLmZpbmRJbnRlcm5hbCA9IGZ1bmN0aW9uIChhLCBuLCBmKSB7XHJcbiAgICBhIGluc3RhbmNlb2YgU3RyaW5nICYmIChhID0gU3RyaW5nKGEpKTtcclxuICAgIGZvciAodmFyIHAgPSBhLmxlbmd0aCwgayA9IDA7IGsgPCBwOyBrKyspIHtcclxuICAgICAgICB2YXIgYiA9IGFba107XHJcbiAgICAgICAgaWYgKG4uY2FsbChmLCBiLCBrLCBhKSkgcmV0dXJuIHsgaTogaywgdjogYiB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgaTogLTEsIHY6IHZvaWQgMCB9O1xyXG59O1xyXG4kanNjb21wLkFTU1VNRV9FUzUgPSAhMTtcclxuJGpzY29tcC5BU1NVTUVfTk9fTkFUSVZFX01BUCA9ICExO1xyXG4kanNjb21wLkFTU1VNRV9OT19OQVRJVkVfU0VUID0gITE7XHJcbiRqc2NvbXAuU0lNUExFX0ZST1VORF9QT0xZRklMTCA9ICExO1xyXG4kanNjb21wLmRlZmluZVByb3BlcnR5ID1cclxuICAgICRqc2NvbXAuQVNTVU1FX0VTNSB8fCBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXHJcbiAgICAgICAgPyBPYmplY3QuZGVmaW5lUHJvcGVydHlcclxuICAgICAgICA6IGZ1bmN0aW9uIChhLCBuLCBmKSB7XHJcbiAgICAgICAgICAgICAgYSAhPSBBcnJheS5wcm90b3R5cGUgJiYgYSAhPSBPYmplY3QucHJvdG90eXBlICYmIChhW25dID0gZi52YWx1ZSk7XHJcbiAgICAgICAgICB9O1xyXG4kanNjb21wLmdldEdsb2JhbCA9IGZ1bmN0aW9uIChhKSB7XHJcbiAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyA9PT0gYVxyXG4gICAgICAgID8gYVxyXG4gICAgICAgIDogXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgZ2xvYmFsICYmIG51bGwgIT0gZ2xvYmFsXHJcbiAgICAgICAgPyBnbG9iYWxcclxuICAgICAgICA6IGE7XHJcbn07XHJcbiRqc2NvbXAuZ2xvYmFsID0gJGpzY29tcC5nZXRHbG9iYWwodGhpcyk7XHJcbiRqc2NvbXAucG9seWZpbGwgPSBmdW5jdGlvbiAoYSwgbiwgZiwgcCkge1xyXG4gICAgaWYgKG4pIHtcclxuICAgICAgICBmID0gJGpzY29tcC5nbG9iYWw7XHJcbiAgICAgICAgYSA9IGEuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgIGZvciAocCA9IDA7IHAgPCBhLmxlbmd0aCAtIDE7IHArKykge1xyXG4gICAgICAgICAgICB2YXIgayA9IGFbcF07XHJcbiAgICAgICAgICAgIGsgaW4gZiB8fCAoZltrXSA9IHt9KTtcclxuICAgICAgICAgICAgZiA9IGZba107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGEgPSBhW2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgcCA9IGZbYV07XHJcbiAgICAgICAgbiA9IG4ocCk7XHJcbiAgICAgICAgbiAhPSBwICYmXHJcbiAgICAgICAgICAgIG51bGwgIT0gbiAmJlxyXG4gICAgICAgICAgICAkanNjb21wLmRlZmluZVByb3BlcnR5KGYsIGEsIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogITAsXHJcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogITAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbiRqc2NvbXAucG9seWZpbGwoXHJcbiAgICBcIkFycmF5LnByb3RvdHlwZS5maW5kXCIsXHJcbiAgICBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIHJldHVybiBhXHJcbiAgICAgICAgICAgID8gYVxyXG4gICAgICAgICAgICA6IGZ1bmN0aW9uIChhLCBmKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkanNjb21wLmZpbmRJbnRlcm5hbCh0aGlzLCBhLCBmKS52O1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXCJlczZcIixcclxuICAgIFwiZXMzXCJcclxuKTtcclxuKGZ1bmN0aW9uIChhLCBuLCBmKSB7XHJcbiAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZFxyXG4gICAgICAgID8gZGVmaW5lKFtcImpxdWVyeVwiXSwgYSlcclxuICAgICAgICA6IFwib2JqZWN0XCIgPT09IHR5cGVvZiBleHBvcnRzICYmIFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiBNZXRlb3JcclxuICAgICAgICA/IChtb2R1bGUuZXhwb3J0cyA9IGEocmVxdWlyZShcImpxdWVyeVwiKSkpXHJcbiAgICAgICAgOiBhKG4gfHwgZik7XHJcbn0pKFxyXG4gICAgZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICB2YXIgbiA9IGZ1bmN0aW9uIChiLCBkLCBlKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0ge1xyXG4gICAgICAgICAgICAgICAgaW52YWxpZDogW10sXHJcbiAgICAgICAgICAgICAgICBnZXRDYXJldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBiLmdldCgwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSBkb2N1bWVudC5zZWxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkID0gci5zZWxlY3Rpb25TdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEgPT09IG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDEwXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBoLmNyZWF0ZVJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCAtYy52YWwoKS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSA9IGUudGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZCB8fCBcIjBcIiA9PT0gZCkgYSA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKEMpIHt9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0Q2FyZXQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuaXMoXCI6Zm9jdXNcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gYi5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5zZXRTZWxlY3Rpb25SYW5nZSkgYy5zZXRTZWxlY3Rpb25SYW5nZShhLCBhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnID0gYy5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLmNvbGxhcHNlKCEwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwgYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5zZWxlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKEIpIHt9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYi5vbihcImtleWRvd24ubWFza1wiLCBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLWtleWNvZGVcIiwgYS5rZXlDb2RlIHx8IGEud2hpY2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLXByZXZpdXMtdmFsdWVcIiwgYi52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcIm1hc2stcHJldml1cy1jYXJldC1wb3NcIiwgYy5nZXRDYXJldCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5tYXNrRGlnaXRQb3NNYXBPbGQgPSBjLm1hc2tEaWdpdFBvc01hcDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLmpNYXNrR2xvYmFscy51c2VJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbnB1dC5tYXNrXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwia2V5dXAubWFza1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5iZWhhdmlvdXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJwYXN0ZS5tYXNrIGRyb3AubWFza1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLmtleWRvd24oKS5rZXl1cCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiY2hhbmdlLm1hc2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwiY2hhbmdlZFwiLCAhMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImJsdXIubWFza1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID09PSBjLnZhbCgpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwiY2hhbmdlZFwiKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcImNoYW5nZWRcIiwgITEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJibHVyLm1hc2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGMudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImZvY3VzLm1hc2tcIiwgZnVuY3Rpb24gKGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEwID09PSBlLnNlbGVjdE9uRm9jdXMgJiYgYShiLnRhcmdldCkuc2VsZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImZvY3Vzb3V0Lm1hc2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGVhcklmTm90TWF0Y2ggJiYgIWsudGVzdChjLnZhbCgpKSAmJiBjLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0UmVnZXhNYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IFtdLCBiLCBjLCBlLCB0LCBmID0gMDsgZiA8IGQubGVuZ3RoOyBmKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChiID0gbC50cmFuc2xhdGlvbltkLmNoYXJBdChmKV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICgoYyA9IGIucGF0dGVyblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8uezF9JHxeLnsxfS9nLCBcIlwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlID0gYi5vcHRpb25hbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChiID0gYi5yZWN1cnNpdmUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChhLnB1c2goZC5jaGFyQXQoZikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodCA9IHsgZGlnaXQ6IGQuY2hhckF0KGYpLCBwYXR0ZXJuOiBjIH0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhLnB1c2goZSB8fCBiID8gYyArIFwiP1wiIDogYykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGEucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hhckF0KGYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBhID0gYS5qb2luKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGEgPSBhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIihcIiArIHQuZGlnaXQgKyBcIiguKlwiICsgdC5kaWdpdCArIFwiKT8pXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKCQxKT9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCh0LmRpZ2l0LCBcImdcIiksIHQucGF0dGVybikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3lFdmVudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiLm9mZihcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnB1dCBrZXlkb3duIGtleXVwIHBhc3RlIGRyb3AgYmx1ciBmb2N1c291dCBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIubWFzayBcIilcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGIuaXMoXCJpbnB1dFwiKSA/IFwidmFsXCIgOiBcInRleHRcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbY10oKSAhPT0gYSkgYltjXShhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGMgPSBiW2NdKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGM7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlQ2FyZXRQb3NpdGlvbjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IGMuZ2V0TWFza2VkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBjLmdldENhcmV0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgIT09IGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBiLmRhdGEoXCJtYXNrLXByZXZpdXMtY2FyZXQtcG9zXCIpIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGcgPSBhLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSAoYSA9IDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IGg7IG0gPCBkICYmIGMubWFza0RpZ2l0UG9zTWFwW21dOyBtKyspIGYrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gaCAtIDE7IDAgPD0gbSAmJiBjLm1hc2tEaWdpdFBvc01hcFttXTsgbS0tKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSBoIC0gMTsgMCA8PSBtOyBtLS0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcFttXSAmJiBsKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IGUgLSAxOyAwIDw9IG07IG0tLSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwT2xkW21dICYmIGsrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA+IGdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGggPSAxMCAqIGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGUgPj0gaCAmJiBlICE9PSBnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGMubWFza0RpZ2l0UG9zTWFwT2xkW2hdIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZSA9IGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaCA9IGggLSAoayAtIGwpIC0gYSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwW2hdICYmIChoID0gZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGggPiBlICYmIChoID0gaCArIChsIC0gaykgKyBmKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGg7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3VyOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGQgPSBkIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgICAgICAgICAgICAgICBjLmludmFsaWQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGIuZGF0YShcIm1hc2sta2V5Y29kZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoLTEgPT09IGEuaW5BcnJheShlLCBsLmJ5UGFzc0tleXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBjLmdldE1hc2tlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IGMuZ2V0Q2FyZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgPSBiLmRhdGEoXCJtYXNrLXByZXZpdXMtdmFsdWVcIikgfHwgXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGMuY2FsY3VsYXRlQ2FyZXRQb3NpdGlvbihnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGEuak1hc2tHbG9iYWxzLmtleVN0cm9rZUNvbXBlbnNhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMudmFsKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5jYWxsYmFja3MoZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGdldE1hc2tlZDogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gdm9pZCAwID09PSBiID8gYy52YWwoKSA6IGIgKyBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcCA9IGYubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IFwicHVzaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gLTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGIgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5yZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBcInVuc2hpZnRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPSBrIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IHAgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgQSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMSA8IGcgJiYgLTEgPCBuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoeCA9IGsgLSAxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChBID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnIDwgayAmJiBuIDwgcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHo7IEEoKTsgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB5ID0gZC5jaGFyQXQoZyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gZi5jaGFyQXQobiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gbC50cmFuc2xhdGlvblt5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2Lm1hdGNoKHEucGF0dGVybilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChoW3JdKHYpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcS5yZWN1cnNpdmUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLTEgPT09IHVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAodSA9IGcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZyA9PT0geCAmJiBnICE9PSB1ICYmIChnID0gdSAtIG0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPT09IHUgJiYgKGcgLT0gbSkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGcgKz0gbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2ID09PSB6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAody0tLCAoeiA9IHZvaWQgMCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxLm9wdGlvbmFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoKGcgKz0gbSksIChuIC09IG0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcS5mYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGhbcl0ocS5mYWxsYmFjayksIChnICs9IG0pLCAobiAtPSBtKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGMuaW52YWxpZC5wdXNoKHsgcDogbiwgdjogdiwgZTogcS5wYXR0ZXJuIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuICs9IG0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYSkgaFtyXSh5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPT09IHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChiLnB1c2gobiksIChuICs9IG0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKCh6ID0geSksIGIucHVzaChuICsgdyksIHcrKyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnICs9IG07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYSA9IGQuY2hhckF0KHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgIT09IHAgKyAxIHx8IGwudHJhbnNsYXRpb25bYV0gfHwgaC5wdXNoKGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBoLmpvaW4oXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5tYXBNYXNrZGlnaXRQb3NpdGlvbnMoaCwgYiwgcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGg7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWFwTWFza2RpZ2l0UG9zaXRpb25zOiBmdW5jdGlvbiAoYSwgYiwgZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEgPSBlLnJldmVyc2UgPyBhLmxlbmd0aCAtIGQgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChkID0gMDsgZCA8IGIubGVuZ3RoOyBkKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwW2JbZF0gKyBhXSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gYy52YWwoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGcgIT09IGYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBbZywgYSwgYiwgZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgZVthXSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlW2FdLmFwcGx5KHRoaXMsIGMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGwoXCJvbkNoYW5nZVwiLCAhMCA9PT0gaCwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uS2V5UHJlc3NcIiwgITAgPT09IGgsIGspO1xyXG4gICAgICAgICAgICAgICAgICAgIGwoXCJvbkNvbXBsZXRlXCIsIGcubGVuZ3RoID09PSBkLmxlbmd0aCwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uSW52YWxpZFwiLCAwIDwgYy5pbnZhbGlkLmxlbmd0aCwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLmludmFsaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBiID0gYShiKTtcclxuICAgICAgICAgICAgdmFyIGwgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZiA9IGMudmFsKCksXHJcbiAgICAgICAgICAgICAgICBrO1xyXG4gICAgICAgICAgICBkID0gXCJmdW5jdGlvblwiID09PSB0eXBlb2YgZCA/IGQoYy52YWwoKSwgdm9pZCAwLCBiLCBlKSA6IGQ7XHJcbiAgICAgICAgICAgIGwubWFzayA9IGQ7XHJcbiAgICAgICAgICAgIGwub3B0aW9ucyA9IGU7XHJcbiAgICAgICAgICAgIGwucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSBjLmdldENhcmV0KCk7XHJcbiAgICAgICAgICAgICAgICBsLm9wdGlvbnMucGxhY2Vob2xkZXIgJiYgYi5yZW1vdmVBdHRyKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLW1heGxlbmd0aFwiKSAmJiBiLnJlbW92ZUF0dHIoXCJtYXhsZW5ndGhcIik7XHJcbiAgICAgICAgICAgICAgICBjLmRlc3Ryb3lFdmVudHMoKTtcclxuICAgICAgICAgICAgICAgIGMudmFsKGwuZ2V0Q2xlYW5WYWwoKSk7XHJcbiAgICAgICAgICAgICAgICBjLnNldENhcmV0KGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGwuZ2V0Q2xlYW5WYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5nZXRNYXNrZWQoITApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsLmdldE1hc2tlZFZhbCA9IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5nZXRNYXNrZWQoITEsIGEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsLmluaXQgPSBmdW5jdGlvbiAoZykge1xyXG4gICAgICAgICAgICAgICAgZyA9IGcgfHwgITE7XHJcbiAgICAgICAgICAgICAgICBlID0gZSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGwuY2xlYXJJZk5vdE1hdGNoID0gYS5qTWFza0dsb2JhbHMuY2xlYXJJZk5vdE1hdGNoO1xyXG4gICAgICAgICAgICAgICAgbC5ieVBhc3NLZXlzID0gYS5qTWFza0dsb2JhbHMuYnlQYXNzS2V5cztcclxuICAgICAgICAgICAgICAgIGwudHJhbnNsYXRpb24gPSBhLmV4dGVuZChcclxuICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICBhLmpNYXNrR2xvYmFscy50cmFuc2xhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBlLnRyYW5zbGF0aW9uXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgbCA9IGEuZXh0ZW5kKCEwLCB7fSwgbCwgZSk7XHJcbiAgICAgICAgICAgICAgICBrID0gYy5nZXRSZWdleE1hc2soKTtcclxuICAgICAgICAgICAgICAgIGlmIChnKSBjLmV2ZW50cygpLCBjLnZhbChjLmdldE1hc2tlZCgpKTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucGxhY2Vob2xkZXIgJiYgYi5hdHRyKFwicGxhY2Vob2xkZXJcIiwgZS5wbGFjZWhvbGRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwibWFza1wiKSAmJiBiLmF0dHIoXCJhdXRvY29tcGxldGVcIiwgXCJvZmZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZiA9ICEwOyBnIDwgZC5sZW5ndGg7IGcrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IGwudHJhbnNsYXRpb25bZC5jaGFyQXQoZyldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaCAmJiBoLnJlY3Vyc2l2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9ICExO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIm1heGxlbmd0aFwiLCBkLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKFwibWFzay1tYXhsZW5ndGhcIiwgITApO1xyXG4gICAgICAgICAgICAgICAgICAgIGMuZGVzdHJveUV2ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGMuZXZlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZyA9IGMuZ2V0Q2FyZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjLnZhbChjLmdldE1hc2tlZCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsLmluaXQoIWIuaXMoXCJpbnB1dFwiKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhLm1hc2tXYXRjaGVycyA9IHt9O1xyXG4gICAgICAgIHZhciBmID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBhKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGQgPSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBlID0gYi5hdHRyKFwiZGF0YS1tYXNrXCIpO1xyXG4gICAgICAgICAgICAgICAgYi5hdHRyKFwiZGF0YS1tYXNrLXJldmVyc2VcIikgJiYgKGQucmV2ZXJzZSA9ICEwKTtcclxuICAgICAgICAgICAgICAgIGIuYXR0cihcImRhdGEtbWFzay1jbGVhcmlmbm90bWF0Y2hcIikgJiYgKGQuY2xlYXJJZk5vdE1hdGNoID0gITApO1xyXG4gICAgICAgICAgICAgICAgXCJ0cnVlXCIgPT09IGIuYXR0cihcImRhdGEtbWFzay1zZWxlY3RvbmZvY3VzXCIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGQuc2VsZWN0T25Gb2N1cyA9ICEwKTtcclxuICAgICAgICAgICAgICAgIGlmIChwKGIsIGUsIGQpKSByZXR1cm4gYi5kYXRhKFwibWFza1wiLCBuZXcgbih0aGlzLCBlLCBkKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHAgPSBmdW5jdGlvbiAoYiwgZCwgZSkge1xyXG4gICAgICAgICAgICAgICAgZSA9IGUgfHwge307XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGEoYikuZGF0YShcIm1hc2tcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IEpTT04uc3RyaW5naWZ5O1xyXG4gICAgICAgICAgICAgICAgYiA9IGEoYikudmFsKCkgfHwgYShiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIGQgJiYgKGQgPSBkKGIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvYmplY3RcIiAhPT0gdHlwZW9mIGMgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYoYy5vcHRpb25zKSAhPT0gZihlKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5tYXNrICE9PSBkXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHcpIHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGsgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgYSA9IFwib25cIiArIGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGEgaW4gYjtcclxuICAgICAgICAgICAgICAgIGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAoYi5zZXRBdHRyaWJ1dGUoYSwgXCJyZXR1cm47XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIChlID0gXCJmdW5jdGlvblwiID09PSB0eXBlb2YgYlthXSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgYS5mbi5tYXNrID0gZnVuY3Rpb24gKGIsIGQpIHtcclxuICAgICAgICAgICAgZCA9IGQgfHwge307XHJcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy5zZWxlY3RvcixcclxuICAgICAgICAgICAgICAgIGMgPSBhLmpNYXNrR2xvYmFscyxcclxuICAgICAgICAgICAgICAgIGYgPSBjLndhdGNoSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIGMgPSBkLndhdGNoSW5wdXRzIHx8IGMud2F0Y2hJbnB1dHM7XHJcbiAgICAgICAgICAgIHZhciBrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAodGhpcywgYiwgZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEodGhpcykuZGF0YShcIm1hc2tcIiwgbmV3IG4odGhpcywgYiwgZCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhKHRoaXMpLmVhY2goayk7XHJcbiAgICAgICAgICAgIGUgJiZcclxuICAgICAgICAgICAgICAgIFwiXCIgIT09IGUgJiZcclxuICAgICAgICAgICAgICAgIGMgJiZcclxuICAgICAgICAgICAgICAgIChjbGVhckludGVydmFsKGEubWFza1dhdGNoZXJzW2VdKSxcclxuICAgICAgICAgICAgICAgIChhLm1hc2tXYXRjaGVyc1tlXSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhKGRvY3VtZW50KS5maW5kKGUpLmVhY2goayk7XHJcbiAgICAgICAgICAgICAgICB9LCBmKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGEuZm4ubWFza2VkID0gZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YShcIm1hc2tcIikuZ2V0TWFza2VkVmFsKGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYS5mbi51bm1hc2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYS5tYXNrV2F0Y2hlcnNbdGhpcy5zZWxlY3Rvcl0pO1xyXG4gICAgICAgICAgICBkZWxldGUgYS5tYXNrV2F0Y2hlcnNbdGhpcy5zZWxlY3Rvcl07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBhKHRoaXMpLmRhdGEoXCJtYXNrXCIpO1xyXG4gICAgICAgICAgICAgICAgYiAmJiBiLnJlbW92ZSgpLnJlbW92ZURhdGEoXCJtYXNrXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGEuZm4uY2xlYW5WYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEoXCJtYXNrXCIpLmdldENsZWFuVmFsKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhLmFwcGx5RGF0YU1hc2sgPSBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICBiID0gYiB8fCBhLmpNYXNrR2xvYmFscy5tYXNrRWxlbWVudHM7XHJcbiAgICAgICAgICAgIChiIGluc3RhbmNlb2YgYSA/IGIgOiBhKGIpKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihhLmpNYXNrR2xvYmFscy5kYXRhTWFza0F0dHIpXHJcbiAgICAgICAgICAgICAgICAuZWFjaChmKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGsgPSB7XHJcbiAgICAgICAgICAgIG1hc2tFbGVtZW50czogXCJpbnB1dCx0ZCxzcGFuLGRpdlwiLFxyXG4gICAgICAgICAgICBkYXRhTWFza0F0dHI6IFwiKltkYXRhLW1hc2tdXCIsXHJcbiAgICAgICAgICAgIGRhdGFNYXNrOiAhMCxcclxuICAgICAgICAgICAgd2F0Y2hJbnRlcnZhbDogMzAwLFxyXG4gICAgICAgICAgICB3YXRjaElucHV0czogITAsXHJcbiAgICAgICAgICAgIGtleVN0cm9rZUNvbXBlbnNhdGlvbjogMTAsXHJcbiAgICAgICAgICAgIHVzZUlucHV0OlxyXG4gICAgICAgICAgICAgICAgIS9DaHJvbWVcXC9bMi00XVswLTldfFNhbXN1bmdCcm93c2VyLy50ZXN0KFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XHJcbiAgICAgICAgICAgICAgICApICYmIGsoXCJpbnB1dFwiKSxcclxuICAgICAgICAgICAgd2F0Y2hEYXRhTWFzazogITEsXHJcbiAgICAgICAgICAgIGJ5UGFzc0tleXM6IFs5LCAxNiwgMTcsIDE4LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDkxXSxcclxuICAgICAgICAgICAgdHJhbnNsYXRpb246IHtcclxuICAgICAgICAgICAgICAgIDA6IHsgcGF0dGVybjogL1xcZC8gfSxcclxuICAgICAgICAgICAgICAgIDk6IHsgcGF0dGVybjogL1xcZC8sIG9wdGlvbmFsOiAhMCB9LFxyXG4gICAgICAgICAgICAgICAgXCIjXCI6IHsgcGF0dGVybjogL1xcZC8sIHJlY3Vyc2l2ZTogITAgfSxcclxuICAgICAgICAgICAgICAgIEE6IHsgcGF0dGVybjogL1thLXpBLVowLTldLyB9LFxyXG4gICAgICAgICAgICAgICAgUzogeyBwYXR0ZXJuOiAvW2EtekEtWl0vIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhLmpNYXNrR2xvYmFscyA9IGEuak1hc2tHbG9iYWxzIHx8IHt9O1xyXG4gICAgICAgIGsgPSBhLmpNYXNrR2xvYmFscyA9IGEuZXh0ZW5kKCEwLCB7fSwgaywgYS5qTWFza0dsb2JhbHMpO1xyXG4gICAgICAgIGsuZGF0YU1hc2sgJiYgYS5hcHBseURhdGFNYXNrKCk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhLmpNYXNrR2xvYmFscy53YXRjaERhdGFNYXNrICYmIGEuYXBwbHlEYXRhTWFzaygpO1xyXG4gICAgICAgIH0sIGsud2F0Y2hJbnRlcnZhbCk7XHJcbiAgICB9LFxyXG4gICAgd2luZG93LmpRdWVyeSxcclxuICAgIHdpbmRvdy5aZXB0b1xyXG4pO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlRXhlbXBsZSB7XHJcbiAgICAvL2Vzc2UgZWggdW0gZXhlbXBsbyBkZSBzZXJ2aWNlXHJcbiAgICAvL2Vzc2Egcm90YSwgZWggdW0gZXhlbXBsbyBkZSByb3RhIGRlY2xhcmFkYSBkZW50cm8gZG8gc2VydmljZSBub2RlXHJcbiAgICAvL29zIHNlcnZpY2VzIHNlcnZlbSBwYXJhIGNvbnN1bWlyIGFwaXMgZSBhcGlzIHByaXZhZGFzXHJcbiAgICBhc3luYyBnZXRBbGxJbmZvQ2xpZW50KGlkKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgICBgL2NsaWVudGFwaS9nZXRJbmZvQ2xpZW50LyR7aWR9YCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGEuanNvbigpO1xyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwicmVnZW5lcmF0b3ItcnVudGltZVwiO1xyXG5pbXBvcnQgRXhlbXBsZSBmcm9tIFwiLi9jb21wb25lbnRzL0V4ZW1wbGUuanNcIjtcclxuaW1wb3J0IENvZGVTZWxsZXIgZnJvbSBcIi4vY29tcG9uZW50cy9Db2RlU2VsbGVyLmpzXCI7XHJcbmltcG9ydCBcIi4vbGliL2pxdWVyeS5tYXNrLm1pbi5qc1wiO1xyXG5pbXBvcnQgcHJpY2VNZXRlclByb21vdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3ByaWNlTWV0ZXJQcm9tb3Rpb24uanNcIjtcclxuXHJcbmNsYXNzIENoZWNrb3V0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgbmV3IEV4ZW1wbGUoKTtcclxuICAgICAgICBuZXcgQ29kZVNlbGxlcigpO1xyXG4gICAgICAgIG5ldyBwcmljZU1ldGVyUHJvbW90aW9uKCk7XHJcbiAgICAgICAgLy8gbmV3IFdhcmVob3VzZVZhbGlkYXRpb24oKTtcclxuICAgICAgICAvLyBuZXcgU2FsZXNtYW5Db2RlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5ldyBDaGVja291dCgpO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgIHNjcmlwdC5kZWZlciA9IHRydWU7XHJcbiAgICBzY3JpcHQuc3JjID0gXCIvL3N1aXRlLmxpbnhpbXB1bHNlLm5ldC9pbXB1bHNlL2ltcHVsc2UuanNcIjtcclxuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFwaWtleVwiLCBcInBhZG92YW5pXCIpO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG59KSgpO1xyXG5cclxuY29uc29sZS5sb2coJ2N1c3RvbSBjaGVja291dCAxLjAuMyBwYXltZWUnKTsgIFxyXG4hZnVuY3Rpb24odCxlLGkpe1xyXG4gICAgdmFyIHI9dC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLFxyXG4gICAgcz10LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcclxuICAgIHIudHlwZT1cInRleHQvamF2YXNjcmlwdFwiLFxyXG4gICAgci5zcmM9XCJodHRwczovL3BwcHZ0ZXgucGF5bWVlLmNvbS5ici9wYXltZWUucGFyY2VsYWRvLnZ0ZXguanM/XCIrbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSxcclxuICAgIHIuaWQ9XCJwYXltZWVJbnN0YWxsbWVudFwiLHMuYXBwZW5kQ2hpbGQocik7XHJcbn0oZG9jdW1lbnQpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==