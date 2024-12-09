import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const pageSize = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") ?? "";
    let page = searchParams.get("page") || "1";

    if (parseInt(page) <= 0 || isNaN(parseInt(page))) {
      page = "1";
    }

    const stores = await prisma.store.findMany({
      take: pageSize,
      skip: (parseInt(page) - 1) * pageSize,
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            product: true,
          },
        },
      },
    });
    const totalStores = await prisma.product.count({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
    });

    return Response.json({
      stores,
      totalPages: Math.ceil(totalStores / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("error when get stores:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
