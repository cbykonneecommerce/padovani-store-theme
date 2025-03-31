import { UserInputError } from '@vtex/api'
export async function masterdataValidate(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { entity } = params
  const rangeHeader = ctx.get('REST-Range');

  ctx.state.dataEntity = entity;
  ctx.state.paginationRange = rangeHeader;

  if (!entity)
  {
    throw new UserInputError('Entity is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }
  //else if (!rangeHeader)
  //  throw new UserInputError('Range is required')

  await next()
}
