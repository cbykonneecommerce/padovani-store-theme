import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { AppKey, AppToken } from '../keys'

export class Orders extends JanusClient {
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

  public async getOrders(filter: string) {
    return await this.http.get(`/api/oms/pvt/orders/?${filter}`)
  }

  public async getOrder(code: string) {
    return await this.http.get(`/api/oms/pvt/orders/${code}`)
  }
}