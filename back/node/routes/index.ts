import { method } from "@vtex/api";

import { masterdata } from "./masterdata";
import { validate } from "../middlewares/validate";
import { catalogProductsFromCollection } from "./catalog-products-from-collection";
import { status } from "./status";
import { masterdataValidate } from "../middlewares/masterdata-validate";
import { catalogProductsFromCollectionValidate } from "../middlewares/catalog-products-from-collection-validate";
import { getCupons } from "./getCupons";
import { getVendorCode } from "./getVendorCode";
import { getVendorData } from "./getVendorData";

export const routes = {
  // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
  status: method({
    GET: [validate, status],
  }),
  masterdata: method({
    GET: [masterdataValidate, masterdata],
  }),
  catalogProductsFromCollections: method({
    GET: [catalogProductsFromCollectionValidate, catalogProductsFromCollection],
  }),
  getCupons: method({
    GET: [getCupons],
  }),
  getVendorCode: method({
    GET: [getVendorCode],
  }),
  getVendorData: method({
    GET: [getVendorData],
  }),
};
