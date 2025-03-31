import "regenerator-runtime";
import Exemple from "./components/Exemple.js";
import CodeSeller from "./components/CodeSeller.js";
import "./lib/jquery.mask.min.js";
import priceMeterPromotion from "./components/priceMeterPromotion.js";

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

console.log('custom checkout 1.0.3 paymee');  
!function(t,e,i){
    var r=t.createElement("script"),
    s=t.getElementsByTagName("body")[0];
    r.type="text/javascript",
    r.src="https://pppvtex.paymee.com.br/paymee.parcelado.vtex.js?"+new Date().getMilliseconds(),
    r.id="paymeeInstallment",s.appendChild(r);
}(document);