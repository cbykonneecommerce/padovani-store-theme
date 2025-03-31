/* eslint-disable no-return-await */
import type { InstanceOptions, IOContext } from "@vtex/api";
import { JanusClient } from "@vtex/api";

import { AppKey, AppToken } from "../keys";
import { ICuponRequest } from "../@types/types";

export default class Cupon extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        "X-VTEX-API-AppToken": AppToken,
        "X-VTEX-API-AppKey": AppKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        VtexIdclientAuthCookie: context.authToken,
      },
    });
  }

  public async getAllCuponsNotArchived(): Promise<ICuponRequest> {
    return await this.http.get("/api/rnb/v2/pvt/coupon/");
  }
}
