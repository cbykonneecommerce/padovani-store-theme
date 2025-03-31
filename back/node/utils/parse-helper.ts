import { PaginationArgs } from "@vtex/clients/build/clients/masterData/MasterDataEntity"
import { ParsedUrlQuery } from "querystring"


export function ParseFields(fields: string): string[]
{
  if (!fields)
    return []


  return fields.split(',')
}

export function ParseRangeHeader(rawRangeReader: string): PaginationArgs
{
  if (!rawRangeReader)
    return {page : 0, pageSize : 0}

  let arrRangeHeader = rawRangeReader.split("=")
  if (arrRangeHeader.length > 1)
  {
    arrRangeHeader = arrRangeHeader[1].split("-")
    if (arrRangeHeader.length > 1)
    {
      return {page : parseInt(arrRangeHeader[0]), pageSize : parseInt(arrRangeHeader[1])}
    }
    else
      return {page : 0, pageSize : 0}
  }
  else
    return {page : 0, pageSize: 0}
}

export function ParseWhere(Obj: ParsedUrlQuery): string
{
  let queryString = '';
  let i = 0;

  if (!Obj)
    return ''

  for (const [key, value] of Object.entries(Obj))
  {
    if (key != "_fields")
    {
      if (i > 0)
        queryString = queryString + '&';

      queryString = queryString + `${key}=${value}`;
      i++;
    }
  }
  return queryString
}
