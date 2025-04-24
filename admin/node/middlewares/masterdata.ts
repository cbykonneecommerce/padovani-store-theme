import { ForbiddenError } from "@vtex/api";

import {
  ParseFields,
  ParseRangeHeader,
  ParseWhere,
} from "../utils/parse-helper";

export async function masterdata(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata },
  } = ctx;

  let parsedFields: string[] = [];

  if (ctx.query["_fields"])
    parsedFields = ParseFields(ctx.query["_fields"].toString());

  const parsedWhere = ParseWhere(ctx.query);
  let rawWhere = "";

  if (parsedFields.length == 0) parsedFields.push("_all");

  const dataEntity = ctx.state.dataEntity.toString();
  let rangeHeader = "";

  if (!ctx.state.paginationRange) rangeHeader = "1-10";
  else rangeHeader = ctx.state.paginationRange;

  const paRangeHeader = ParseRangeHeader(rangeHeader);

  if (
    dataEntity != "LN" &&
    dataEntity != "CL" &&
    dataEntity != "EX" &&
    dataEntity != "MS" &&
    dataEntity != "SM"
  ) {
    throw new ForbiddenError("Entity not allowed");
  } else {
    if (ctx.query["_where"]) rawWhere = ctx.query["_where"].toString();
    else rawWhere = parsedWhere;
  }

  let sort: string = "createdIn DESC";

  if (ctx.state.sort) {
    sort = ctx.state.sort.toString();
  }

  const data = await masterdata.searchDocuments({
    dataEntity: dataEntity,
    fields: parsedFields,
    where: rawWhere,
    pagination: paRangeHeader,
    sort: sort,
  });

  ctx.body = data;
  ctx.set("cache-control", "no-cache"); //max-age=120 production //no-cache

  await next();
}
