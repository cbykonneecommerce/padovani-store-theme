import { IOClients, MasterData } from "@vtex/api";
import { Catalog } from "@vtex/clients";

import Status from "./status";
import { CatalogEnhanced } from "./catalogEnhanced";
import Cupon from "./Cupon";
import MasterDataService from "./MasterDataService";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get status() {
    return this.getOrSet("status", Status);
  }

  public get masterdata() {
    return this.getOrSet("masterdata", MasterData);
  }

  public get catalog() {
    return this.getOrSet("catalog", Catalog);
  }

  public get catalogEnhanced() {
    return this.getOrSet("catalogEnhanced", CatalogEnhanced);
  }

  public get cuponService() {
    return this.getOrSet("Cupon", Cupon);
  }
  public get masterDataService() {
    return this.getOrSet('materDataService', MasterDataService)
  }
}
