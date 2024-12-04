import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { fileInfo, UploadcareSimpleAuthSchema } from "@uploadcare/rest-client";

export async function GET(request: NextRequest) {
  try {
    const PAGE_SIZE = 10;

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    let page = searchParams.get("page") || "1";

    if (parseInt(page) <= 0 || isNaN(parseInt(page))) {
      page = "1";
    }

    const currentPage = parseInt(page, 10);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const products = await prisma.product.findMany({
      skip,
      take: PAGE_SIZE,
      where: {
        store: {
          userId: session.user?.id,
        },
      },
      include: {
        category: true,
      },
    });

    return Response.json({
      products,
      totalPages: Math.ceil(products.length / PAGE_SIZE),
      currentPage,
    });
  } catch (error) {
    console.log("error when get dashboard/products", error);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    // validation
    if (
      !body.name ||
      !body.description ||
      !body.categorySlug ||
      !body.price ||
      !Array.isArray(body.images) ||
      body.images.length === 0
    ) {
      return new Response("Bad Request: Invalid input", { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: {
        userId: session.user?.id,
      },
    });

    if (!store) {
      return new Response("Store not found", { status: 404 });
    }

    const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
      secretKey: process.env.UPLOADCARE_SECRET_KEY!,
    });

    const imageUrls: string[] = await Promise.all(
      body.images.map(async (imageId: string) => {
        const result = await fileInfo(
          { uuid: imageId },
          { authSchema: uploadcareSimpleAuthSchema }
        );
        console.log(result);
        return result.originalFileUrl;
      })
    );

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        slug: body.name.trim().replaceAll(" ", "-").toLowerCase(),
        categorySlug: body.categorySlug,
        storeId: store.id,
        images: {
          createMany: {
            data: imageUrls.map((url) => ({ url })),
            skipDuplicates: true,
          },
        },
      },
    });

    return Response.json(product);
  } catch (error) {
    // Tangani berbagai jenis error dari Prisma atau lainnya
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Client Known Error:", error.message);
      return new Response(`Database error: ${error.message}`, { status: 500 });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma Validation Error:", error.message);
      return new Response(`Validation error: ${error.message}`, {
        status: 400,
      });
    }

    // Tangani error tak terduga lainnya
    console.error("Unexpected Error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
}
