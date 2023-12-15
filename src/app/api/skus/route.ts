import getClient from "@/lib/commerce-layer";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const client = await getClient();
  const skus = await client.skus.list({
    include: ["prices", "prices.price_volume_tiers"],
  });

  return NextResponse.json(skus);
}

export async function POST(req: Request, res: NextApiResponse) {
  const client = await getClient();

  const { item } = await req.json();

  const createOrder = await client.orders.create({});

  const sku = await client.line_items.create({
    order: createOrder,
    quantity: 1,
    item: item,
  });

  const getOrder = await client.orders.retrieve(createOrder.id, {
    include: ["line_items"],
  });

  return NextResponse.json({ order: getOrder });
}

export async function PATCH(req: Request, res: NextApiResponse) {
  const client = await getClient();

  const { orderId, email } = await req.json();

  const updateOrder = await client.orders.update({
    id: orderId,
    customer_email: email,
  });

  return NextResponse.json({ updateOrder });
}
