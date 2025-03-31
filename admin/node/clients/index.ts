import { IOClients } from '@vtex/api'
import { MasterData } from '@vtex/api'
import { Catalog } from '@vtex/clients'
import { OrdersService } from './orderService'
import { Orders } from './orders'

import Status from './status'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  myClient: any
  public get status() {
    return this.getOrSet('status', Status)
  }
  public get masterdata(){
    return this.getOrSet('masterdata', MasterData)
  }
  public get updatePartialDocument(){
    return this.getOrSet('masterdata', MasterData)
  }
  public get catalog(){
    return this.getOrSet('masterdata', Catalog)
  }
  public get orderService() {
    return this.getOrSet('ordersService', OrdersService)
  }
  public get orders() {
    return this.getOrSet('orders', Orders)
  }
}
