import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { btoa } from "buffer";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: session.user?.id,
      },
      include: {
        invoice: true,
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                store: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return Response.json(orders);
  } catch (error) {
    console.log("error when get order", error);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!session.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const cart = await prisma.cart.findUnique({
      where: {
        id: body.cartId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart || cart.cartItems.length <= 0) {
      return new Response("Cart not found", {
        status: 404,
        statusText: "Cart not found",
      });
    }

    const cartItems = cart.cartItems.map((cartItem) => {
      return {
        price: cartItem.price,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user?.id,
        cartId: cart.id,
        totalPrice: cart.totalPrice || 0,
        orderItems: {
          createMany: {
            data: cartItems,
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cartItems: {
          deleteMany: cart.cartItems.map((val) => ({ id: val.id })),
        },
      },
    });

    const responseInvoice = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: order.id,
        amount: order.totalPrice,
        // currency: "USD",
      },
      {
        headers: {
          Authorization: `Basic ${btoa(process.env.XENDIT_API_KEY! + ":")}`,
        },
      }
    );

    const invoice = await prisma.invoice.create({
      data: {
        amount: responseInvoice.data.amount,
        orderId: responseInvoice.data.external_id,
        paymentId: responseInvoice.data.id,
        status: responseInvoice.data.status,
        invoiceUrl: responseInvoice.data.invoice_url,
      },
    });

    return Response.json(invoice);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Client Known Error:", error.message);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error("Prisma Client Unknown Error:", error.message);
      return new Response("An unknown database error occurred", {
        status: 500,
      });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma Validation Error:", error.message);
      return new Response(`Validation error: ${error.message}`, {
        status: 400,
      });
    } else {
      console.error("Unexpected Error:", error);
      return new Response("Something went wrong", { status: 500 });
    }
  }
}
