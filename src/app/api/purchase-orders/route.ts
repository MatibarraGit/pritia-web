import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { PURCHASE_ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, PRODUCTS_PER_PAGE } from "@/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const search = searchParams.get('search') ?? "";

    const offset = (page - 1) * PRODUCTS_PER_PAGE; 
    
    const orders = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT 
      po.*,
      SUM (poi.total)::integer AS order_total
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON poi.order_id = po.order_id
      WHERE po.client ILIKE '%' || ${search} || '%'
      GROUP BY po.order_id
      LIMIT ${PRODUCTS_PER_PAGE}
      OFFSET ${offset};
    `;

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "Aún no hay órdenes de compra" },
        { status: 200 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al obtener órdenes de compra: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { orderData } = await request.json();
    const {
      client: orderClient,
      orderStatus,
      paymentMethod,
      paymentStatus,
      items,
    } = orderData;

    const client = orderClient ?? null;
    const order_status = (orderStatus ?? PURCHASE_ORDER_STATUS.UNCONFIRMED).replace(/ /g, '_');
    const payment_method = (paymentMethod ?? PAYMENT_METHODS.UNSPECIFIED).replace(/ /g, '_');
    const payment_status = (paymentStatus ?? PAYMENT_STATUS.PENDING).replace(/ /g, '_');

    // Validaciones
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'No se puede crear una orden de compra sin productos' },
        { status: 400 }
      );
    }

    // Crear la orden y sus items en una transacción
    await prisma.purchase_orders.create({
      data: {
        client: client,
        order_status: order_status,
        payment_method: payment_method,
        payment_status: payment_status,
        purchase_order_items: {
          create: items.map((item: { productId: number; quantity: number; unitPrice: number; unitCost?: number; discount?: number }) => ({            
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            unit_cost: item.unitCost,
            discount: item.discount || 0,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: 'Orden de compra creada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error al crear orden de compra: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

