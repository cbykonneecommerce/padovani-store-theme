import type {
  InstanceOptions,
  IOContext,
  RequestTracingConfig,
} from '@vtex/api'

import { JanusClient } from '@vtex/api'
import { getRequestConfig } from '../utils/request-helpers'

const baseURL = '/api/catalog'
//const baseURLLegacy = '/api/catalog_system'

const routes = {
    getProductsFromCollectionById: (collectionId: string, page: number, pageSize: number) =>
    `${baseURL}/pvt/collection/${collectionId}/products?page=${page}&pageSize=${pageSize}`
}

export class CatalogEnhanced extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
    })
  }

  public getProductsFromCollectionById(
    collectionId: string,
    page = 1,
    pageSize = 10,
    tracingConfig?: RequestTracingConfig
  ) {
    const metric = 'catalog-getProductsFromCollectionByIdMetric'

    return this.http.get(
      routes.getProductsFromCollectionById(collectionId, page, pageSize),
      getRequestConfig(this.context, metric, tracingConfig)
    )
  }
}
