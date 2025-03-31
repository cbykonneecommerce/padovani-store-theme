export async function catalogProductsFromCollection(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalogEnhanced },
  } = ctx

  console.log(ctx.query)
  console.log(ctx.querystring)

  const {collectionId} = ctx.vtex.route.params

  console.log(collectionId)

  let page = 1
  let pageSize = 10

  if (ctx.query["page"])
    page = Number.parseInt(ctx.query["page"].toString())

  if (ctx.query["page"])
    pageSize = Number.parseInt(ctx.query["pageSize"].toString())

  console.log("Page: ", page)
  console.log("Page Size: ", pageSize)

  const productsJson = await catalogEnhanced.getProductsFromCollectionById(collectionId.toString(), page, pageSize)

  ctx.body = productsJson
  ctx.set('cache-control', 'no-cache') //max-age=120 production //no-cache

  await next();
}
