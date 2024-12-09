import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

const pageSize = 12;
// get products from specific store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const searchParams = request.nextUrl.searchParams;
    let page = searchParams.get("page") || "1";

    // Validasi halaman
    if (parseInt(page) <= 0 || isNaN(parseInt(page))) {
      page = "1";
    }

    const products = await prisma.product.findMany({
      take: pageSize,
      skip: (parseInt(page) - 1) * pageSize,
      where: {
        storeId: { equals: id },
      },
      include: {
        images: true,
      },
    });

    return Response.json({
      products,
      totalPages: Math.ceil(products.length / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log("error when get store products", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
