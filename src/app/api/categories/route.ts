import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return Response.json(categories);
  } catch (error) {
    console.log("Error Server", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
}
