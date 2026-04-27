import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { orderItems, orders } from '@/db/schema';
import { getProductsByIds } from '@/server/catalog';

type CheckoutRequestItem = {
  productId: unknown;
  quantity: unknown;
};

type CheckoutRequestBody = {
  items?: CheckoutRequestItem[];
};

const MAX_CHECKOUT_ITEMS = 50;
const MAX_QUANTITY = 99;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5;

function isValidCheckoutItem(item: CheckoutRequestItem) {
  return (
    Number.isInteger(item.productId) &&
    Number(item.productId) > 0 &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) > 0 &&
    Number(item.quantity) <= MAX_QUANTITY
  );
}

export async function POST(request: NextRequest) {
  let body: CheckoutRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ message: 'Checkout items are required' }, { status: 400 });
  }

  if (body.items.length > MAX_CHECKOUT_ITEMS) {
    return NextResponse.json({ message: 'Too many checkout items' }, { status: 400 });
  }

  if (!body.items.every(isValidCheckoutItem)) {
    return NextResponse.json({ message: 'Invalid checkout item' }, { status: 400 });
  }

  try {
    const quantityByProductId = new Map<number, number>();

    for (const item of body.items) {
      const productId = Number(item.productId);
      quantityByProductId.set(productId, (quantityByProductId.get(productId) ?? 0) + Number(item.quantity));
    }

    const requestedProductIds = [...quantityByProductId.keys()];
    const checkoutProducts = await getProductsByIds(requestedProductIds);
    const productById = new Map(checkoutProducts.map((product) => [product.id, product]));

    if (productById.size !== requestedProductIds.length) {
      return NextResponse.json({ message: 'Checkout includes unavailable products' }, { status: 400 });
    }

    const lineItems = requestedProductIds.map((productId) => {
      const product = productById.get(productId);

      if (!product) {
        throw new Error(`Product missing after lookup: ${productId}`);
      }

      const quantity = quantityByProductId.get(productId) ?? 0;

      return {
        productId: product.id,
        title: product.title,
        unitPrice: product.price,
        quantity,
        lineTotal: product.price * quantity,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;
    const order = await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          subtotal,
          shippingFee,
          total,
        })
        .returning();

      if (!createdOrder) {
        throw new Error('Failed to create order');
      }

      await tx.insert(orderItems).values(
        lineItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        }))
      );

      return createdOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      lineItems,
      subtotal,
      shippingFee,
      total,
    });
  } catch (error) {
    console.error('Failed to create checkout:', error);
    return NextResponse.json({ message: 'Failed to create checkout' }, { status: 502 });
  }
}
