// import type { Context } from '@vtex/api';
import type { CustomApp, OrderDataProps } from "../typings/custom";

type FieldsType = {
  codigoVendedor?: string;
};

// Função para aguardar um número específico de milissegundos
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function saveOrders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { orders, masterdata },
  } = ctx;

  try {
    let currentPage = 4;
    let totalPages = 1; // Defina o número desejado de páginas para testar
    const delayBetweenRequests = 1000; // Defina o tempo de espera entre as chamadas (em milissegundos)
    let totalOrders = 0;

    do {
      const data = await orders.getOrders(
        `f_status=invoiced&per_page=100&page=${currentPage}`
      );

      await Promise.all(
        data.list.map(async (order: any) => {
          const getOrder: OrderDataProps = await orders.getOrder(order.orderId);

          const customApps: CustomApp[] =
            getOrder?.customData?.customApps ?? [];
          const customApp = customApps?.find(
            (customApp) => customApp?.id === "codigovendedor"
          );

          totalOrders++;

          if (customApp) {
            const hasCustomData: FieldsType = customApp.fields;
            const createRegister = await masterdata.createDocument({
              dataEntity: "PV",
              fields: {
                id: `${getOrder.orderId}`,
                order: getOrder,
                sellerCode: hasCustomData.codigoVendedor,
              },
            });
          }

          // Aguardar um tempo entre as chamadas para evitar atingir o limite de taxa
          await delay(delayBetweenRequests);
        })
      );

      currentPage++;
      totalPages = data.paging.pages;
    } while (currentPage <= totalPages);

    ctx.body = "Pedidos Mapeados e salvos no masterdata";

    ctx.set("cache-control", "no-cache");
  } catch (error) {
    console.error("Erro ao atualizar documento parcial:", error);
    ctx.throw(500, "Erro Interno do Servidor");
  }

  await next();
}
