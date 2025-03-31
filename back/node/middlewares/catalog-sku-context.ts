import { UserInputError } from '@vtex/api'

export async function catalogSkuAndContext(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalog },
  } = ctx
  console.log(ctx.query)
  console.log(ctx.querystring)

  const {skuid} = ctx.vtex.route.params

  if (!skuid)
  {
    throw new UserInputError('SKUID is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  const data = await catalog.getSkuContext(skuid.toString())

  ctx.body = data
  ctx.set('cache-control', 'no-cache') //max-age=120 production //no-cache

  await next();
}
