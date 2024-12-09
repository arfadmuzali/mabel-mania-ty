import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user?.id,
      },
      include: {
        cartItems: {
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

    return Response.json(cart);
  } catch (error) {
    console.log("error server:", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const quantity = (await body.quantity) ?? 1;

    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user?.id,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      return new Response("Cannot find cart", { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: body.productId,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!product) {
      return new Response("Cannot find product", { status: 404 });
    }

    if (product.store.userId == session.user?.id) {
      return new Response("Cannot add your own product to the cart", {
        status: 403,
      });
    }

    let cartItem;

    // Check if the product is already in the cart
    if (
      cart?.cartItems
        .map((val) => val.productId)
        .includes(product?.id ?? body.productId)
    ) {
      cartItem = await prisma.cartItem.update({
        where: {
          productId: product.id,
        },
        data: {
          quantity: {
            increment: 1,
          },
          price: {
            increment: product.price,
          },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          price: product.price * quantity,
          quantity: quantity,
          cartId: cart.id,
          productId: body.productId,
        },
      });
    }

    // Calculate new total price
    const updatedCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
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
        id: cart.id,
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
