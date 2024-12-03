import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = (await params).id;

    const cartItemId = parseInt(id);

    if (isNaN(cartItemId)) {
      return new Response("Id Invalid", { status: 400 });
    }

    const cartItem = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem) {
      return new Response("Cart item not found", { status: 404 });
    }

    const updatedCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cartItem.cartId,
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    const newTotalPrice = updatedCartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    // Update the cart with the new total price
    await prisma.cart.update({
      where: {
        id: cartItem.cartId,
      },
      data: {
        totalPrice: newTotalPrice,
      },
    });

    return Response.json(cartItem);
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
