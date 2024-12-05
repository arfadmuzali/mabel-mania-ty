import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        orderItems: {
          some: {
            product: {
              store: {
                userId: session.user?.id,
              },
            },
          },
        },
      },
      include: {
        invoice: true,
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
        user: true,
      },
    });

    return Response.json(orders);
  } catch (error) {
    console.log("error when get store order", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
