import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") ?? "";
    let take = searchParams.get("take") ?? "8";

    if (isNaN(parseInt(take ?? "8", 10))) {
      take = "8";
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: parseInt(take),
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      include: {
        images: true,
      },
    });
    return Response.json(products);
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", { status: 500 });
  }
}
