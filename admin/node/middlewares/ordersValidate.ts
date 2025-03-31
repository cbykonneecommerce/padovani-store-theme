import { UserInputError } from '@vtex/api'

export async function ordersValidate(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params, id },
    },
} = ctx

  const { orderId, filter } = params

  if(!filter && id == "getOrders") {
    throw new UserInputError('Filter is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  if (!orderId && id == "getOrder") {
    throw new UserInputError('Order Id is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.orderId = orderId
  ctx.state.filter = filter

  await next()
}
