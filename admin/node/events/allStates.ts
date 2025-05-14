import type { CustomApp, OrderDataProps } from "../typings/custom";

type FieldsType = {
  codigoVendedor?: string;
};

export async function allStates(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const {
    clients: { orderService, masterdata },
  } = ctx;

  const { orderId, currentState } = ctx.body;

  try {
    if (currentState == "invoiced") {
      const orderInfo: OrderDataProps | undefined = await orderService.getOrder(
        orderId
      );
      if (orderInfo) {
        const customApps: CustomApp[] = orderInfo.customData.customApps ?? [];
        const customApp = customApps.find(
          (customApp) => customApp.id === "codigovendedor"
        );

        if (customApp) {
          try {
            const hasCustomData: FieldsType = customApp.fields;
            const createRegister = await masterdata.createDocument({
              dataEntity: "PV",
              fields: {
                id: `${orderInfo.orderId}`,
                order: orderInfo,
                sellerCode: hasCustomData.codigoVendedor,
              },
            });
          } catch (error) {
            console.error("Erro ao criar documento:", error);
          }
        }
      }
    }
    await next();
  } catch (error) {
    console.error("Erro durante o envio de e-mail:", error);
    await next();
  }
}
