import "regenerator-runtime";
import CodeSeller from "./components/CodeSeller.js";
import Exemple from "./components/Exemple.js";
import priceMeterPromotion from "./components/priceMeterPromotion.js";
import "./lib/jquery.mask.min.js";

class Checkout {
    constructor() {
        this.init();
    }

    init() {
        new Exemple();
        new CodeSeller();
        new priceMeterPromotion();
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

!(function (t, e, i) {
    var r = t.createElement("script"),
        s = t.getElementsByTagName("body")[0];
    (r.type = "text/javascript"),
        (r.src =
            "https://pppvtex.paymee.com.br/paymee.parcelado.vtex.js?" +
            new Date().getMilliseconds()),
        (r.id = "paymeeInstallment"),
        s.appendChild(r);
})(document);
