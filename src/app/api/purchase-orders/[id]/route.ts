import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

interface PurchaseOrderItem {
  itemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await prisma.$queryRaw`
      SELECT 
      po.order_id,
      po.client,
      po.order_date,
      SUM(poi.total) AS order_total,
      po.order_status,
      po.payment_method,
      po.payment_status,
      json_agg(
        json_build_object(
          'order_item_id', poi.order_item_id,
          'product_id', poi.product_id,
          'product_image', p.images,
          'product_name', p.product_name,
          'quantity', poi.quantity,
          'unit_price', poi.unit_price,
          'unit_cost', poi.unit_cost,
          'subtotal', poi.subtotal,
          'discount', poi.discount,
          'total', poi.total,
          'date_added', poi.date_added
        )
      ) AS items
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.order_id = poi.order_id
      LEFT JOIN products p ON poi.product_id = p.product_id
      WHERE po.order_id = ${id}
      GROUP BY po.order_id
    `

    if (!order) {
      return NextResponse.json(
        { message: "Esta orden de compra no existe" },
        { status: 200 }
      );
    }

    return NextResponse.json([order], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al obtener orden de compra: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderIdNumber = parseInt(id);

  try {
    const { orderData, itemsHasChanges } = await request.json();
    const {
      client,
      orderStatus,
      paymentMethod,
      paymentStatus,
      items,
    } = orderData;

    // Validaciones
    if (!orderStatus) {
      return NextResponse.json(
        { message: 'Debes seleccionar un estado de la orden' },
        { status: 400 }
      );
    }
    if (!paymentMethod) {
      return NextResponse.json(
        { message: 'Debes seleccionar un método de pago' },
        { status: 400 }
      );
    }
    if (!paymentStatus) {
      return NextResponse.json(
        { message: 'Debes seleccionar un estado de pago' },
        { status: 400 }
      );
    }
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'No se pueden quitar todos los productos de una orden de compra' },
        { status: 400 }
      );
    }

    // Usar transacción para asegurar atomicidad: si falla algo, se revierte todo
    await prisma.$transaction(async (tx) => {
      // Actualizar la orden
      const updatedOrder = await tx.purchase_orders.update({
        where: {
          order_id: orderIdNumber,
        },
        data: {
          client: client,
          order_status: orderStatus.replace(/ /g, '_'),
          payment_status: paymentStatus.replace(/ /g, '_'),
          payment_method: paymentMethod.replace(/ /g, '_'),
        },
      });

      if (!updatedOrder) {
        throw new Error('No se ha podido modificar la orden');
      }

      // Si hay cambios en los items, actualizarlos
      if (itemsHasChanges) {
        const dbItems = await tx.purchase_order_items.findMany({
          where: {
            order_id: orderIdNumber,
          },
        });

        const itemsToInsert = items.filter((item: PurchaseOrderItem) => 
          !dbItems.find(i => i.order_item_id === item.itemId)
        );
        const itemsToUpdate = items.filter((item: PurchaseOrderItem) => 
          dbItems.find(i => i.order_item_id === item.itemId)
        );
        const itemsToDelete = dbItems.filter(item => 
          !items.find((i: PurchaseOrderItem) => i.itemId === item.order_item_id)
        );

        // Insertar nuevos items
        if (itemsToInsert.length > 0) {
          await tx.purchase_order_items.createMany({
            data: itemsToInsert.map((item: PurchaseOrderItem) => ({
              order_id: orderIdNumber,
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              unit_cost: item.unitCost,
              discount: item.discount || 0,
            })),
          });
        }

        // Actualizar items existentes
        if (itemsToUpdate.length > 0) {
          for (const item of itemsToUpdate) {
            await tx.purchase_order_items.update({
              where: {
                order_item_id: item.itemId,
              },
              data: {
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                unit_cost: item.unitCost,
                discount: item.discount || 0
              },
            });
          }
        }

        // Eliminar items
        if (itemsToDelete.length > 0) {
          await tx.purchase_order_items.deleteMany({
            where: {
              order_item_id: {
                in: itemsToDelete.map(item => item.order_item_id),
              },
            },
          });
        }
      }
    });

    return NextResponse.json(
      { message: 'Orden de compra actualizada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error al editar orden de compra: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await prisma.purchase_orders.delete({
      where: {
        order_id: parseInt(id),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: 'No se encontró la orden de compra' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Orden de compra eliminada correctamente" });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al eliminar orden de compra: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}