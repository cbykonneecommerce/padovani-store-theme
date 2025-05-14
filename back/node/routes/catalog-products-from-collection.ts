export async function catalogProductsFromCollection(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalogEnhanced },
  } = ctx

  const {collectionId} = ctx.vtex.route.params

  let page = 1
  let pageSize = 10

  if (ctx.query["page"])
    page = Number.parseInt(ctx.query["page"].toString())

  if (ctx.query["page"])
    pageSize = Number.parseInt(ctx.query["pageSize"].toString())

  const productsJson = await catalogEnhanced.getProductsFromCollectionById(collectionId.toString(), page, pageSize)

  ctx.body = productsJson
  ctx.set('cache-control', 'no-cache') //max-age=120 production //no-cache

  await next();
}
