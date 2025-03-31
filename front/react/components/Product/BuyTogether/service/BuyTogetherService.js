class BuyTogetherService {
    constructor(productId) {
        this.productId = productId;
        this.baseApiUrl = "/api/catalog_system/pub/products/crossselling/";
        this.urlSuggestions = `suggestions/${productId}`;
        this.urlSimilars = `similars/${productId}`;
        this.urlAccessories = `accessories/${productId}`;
        this.urlSkuProduct = "/api/catalog_system/pub/products/search/?fq=skuId:";
    }

    async fetchData(endpoint) {
        const url = this.baseApiUrl + endpoint;
        const req = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return req.json();
    }

    async getSuggestions() {
        return this.fetchData(this.urlSuggestions);
    }

    async getSimilars() {
        return this.fetchData(this.urlSimilars);
    }

    async getAccessories() {
        return this.fetchData(this.urlAccessories);
    }

    async getProductBySku(productId) {
        const req = await fetch(this.urlSkuProduct + productId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        const responseJson = await req.json();

        return responseJson[0];
    }
}

export { BuyTogetherService };