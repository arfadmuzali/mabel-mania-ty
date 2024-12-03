import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cartCount = await prisma.cart.findUnique({
      where: {
        userId: session.user?.id,
      },
      select: {
        _count: {
          select: {
            cartItems: true,
          },
        },
      },
    });

    if (!cartCount) {
      return Response.json({ cart: 0 });
    }

    return Response.json({ count: cartCount?._count.cartItems });
  } catch (error) {
    console.log("server error get cart count: ", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
}
