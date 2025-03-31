// import { UserInputError } from '@vtex/api';

export async function masterdataValidate(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx;

  const { entity, id, userId, type } = params;
  
  const url = ctx.originalUrl;

  const sortMatch = url?.match(/sort=([^&]+)/);
  const sort = sortMatch ? sortMatch[1] : "";

  const rangeMatch = url?.match(/REST-Range=([^&]+)/);
  const rangeHeader = rangeMatch ? rangeMatch[1].toString() : "";

  ctx.state.dataEntity = entity;
  ctx.state.id = id;
  ctx.state.userId = userId;
  ctx.state.paginationRange = rangeHeader;
  ctx.state.type = type;
  ctx.state.sort = sort;

  // if (!entity) {
  //   throw new UserInputError('Entity is required');
  // }
  //else if (!rangeHeader)
  //  throw new UserInputError('Range is required')

  await next();
}
