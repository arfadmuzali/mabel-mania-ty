import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    if (!id) {
      return new Response("Bad Request", { status: 400 });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return Response.json({ product: true });
  } catch (error) {
    console.log("error delete dashboard product", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
