import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    if (request.headers.get("x-callback-token") != process.env.XENDIT_TOKEN) {
      return new Response("Forbidden request", { status: 403 });
    }

    const body = await request.json();

    const invoice = await prisma.invoice.update({
      where: {
        orderId: body.external_id,
      },
      data: {
        status: body.status,
        paymentMethod: body.paymet_method,
        description: body.description,
        paidAt: body.pait_at,
        currency: body.currency,
        feePaidAmount: body.fees_paid_amount,
        bankCode: body.bank_code,
      },
    });

    if (!invoice) {
      return new Response("Failed Update invoice", { status: 400 });
    }

    const order = await prisma.order.update({
      where: {
        id: body.external_id,
      },
      data: {
        status: body.status,
      },
    });
    return Response.json(order);
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
