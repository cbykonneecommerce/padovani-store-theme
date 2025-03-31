import { ICuponRequest } from "../@types/types";

export async function getCupons(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { cuponService },
  } = ctx;

  try {
    const data: ICuponRequest = await cuponService.getAllCuponsNotArchived();
    const cupons = data?.items;

    ctx.status = 200;
    ctx.body = { cupons };
  } catch (error) {
    console.log(error);

    ctx.status = 500;
    ctx.body = { message: error.message };
  }

  await next();
}
