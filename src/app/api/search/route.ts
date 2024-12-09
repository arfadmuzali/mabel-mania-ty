import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

const pageSize = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";
    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    let page = searchParams.get("page") || "1";

    // Validasi halaman
    if (parseInt(page) <= 0 || isNaN(parseInt(page))) {
      page = "1";
    }

    // Validasi minPrice dan maxPrice
    const min =
      minPrice && !isNaN(parseFloat(minPrice))
        ? parseFloat(minPrice)
        : undefined;
    const max =
      maxPrice && !isNaN(parseFloat(maxPrice))
        ? parseFloat(maxPrice)
        : undefined;

    const whereClause: Prisma.ProductWhereInput = {
      name: {
        contains: q,
        mode: Prisma.QueryMode.insensitive,
      },
      categorySlug: {
        contains: category == "all" ? "" : category,
        mode: Prisma.QueryMode.insensitive,
      },
      price: {
        ...(min !== undefined ? { gte: min } : {}),
        ...(max !== undefined ? { lte: max } : {}),
      },
    };

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: whereClause,
      skip: (parseInt(page) - 1) * pageSize,
      take: pageSize,
      include: {
        images: true,
      },
    });

    const totalProducts = await prisma.product.count({ where: whereClause });

    return Response.json({
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("Error when getting search results:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
