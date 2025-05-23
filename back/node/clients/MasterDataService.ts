import type { InstanceOptions, IOContext } from '@vtex/api';
import { JanusClient } from "@vtex/api";
import { AppKey, AppToken } from "../keys";

export default class MasterDataService extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                'X-VTEX-API-AppToken': AppToken,
                'X-VTEX-API-AppKey': AppKey,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                VtexIdclientAuthCookie: context.authToken,
            },
        })
    }

    public async getVendorCode(code: string) {
        try {
            const response = await this.http.get(`/api/dataentities/CV/search?codigovendedor=${code}&_fields=_all`)
            return response
        } catch (error) {
            return error
        }
    }

    public async getVendorData(vendorId: string) {
        try {
            const response = await this.http.get(`/api/dataentities/CV/documents/${vendorId}?_fields=_all`)
            return response
        } catch (error) {
            return error
        }
    }
}
