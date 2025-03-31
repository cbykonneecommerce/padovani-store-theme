import { json } from 'co-body'

export async function ParseRequestBody(ctx: Context, next: () => Promise<any>) {
  ctx.state.payload = await json(ctx.req)
  await next()
}
