import { ForbiddenError } from '@vtex/api';

import { ParseFields, ParseRangeHeader, ParseWhere } from "../utils/parse-helper";

export async function masterdata(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata },
  } = ctx
  let parsedFields: string[] = []

  if (ctx.query["_fields"])
    parsedFields = ParseFields(ctx.query["_fields"].toString())

  const parsedWhere = ParseWhere(ctx.query)
  let rawWhere = ''

  if(parsedFields.length == 0)
    parsedFields.push('_all')

  const dataEntity = ctx.state.dataEntity.toString()
  let rangeHeader = ""

  if (!ctx.state.paginationRange)
    rangeHeader = "resources=1-10"
  else
    rangeHeader = ctx.state.paginationRange

  const paRangeHeader = ParseRangeHeader(rangeHeader)

  if (dataEntity != 'OE')
  {
    throw new ForbiddenError('Entity not allowed')
  }
  else
  {
    if (ctx.query["_where"])
      rawWhere = ctx.query["_where"].toString()
    else
      rawWhere = parsedWhere
  }

  const data = await masterdata.searchDocuments({
    dataEntity : dataEntity,
    fields : parsedFields,
    where :  rawWhere,
    pagination: paRangeHeader
  });

  ctx.body = data
  ctx.set('cache-control', 'no-cache') //max-age=120 production //no-cache

  await next();
}
