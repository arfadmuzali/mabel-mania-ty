import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        _count: {
          select: {
            product: true,
          },
        },
      },
    });

    return Response.json(stores);
  } catch (error) {
    console.log("error", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthrized", { status: 401 });
    }

    const body = await request.json();

    if (
      !body.name ||
      body.name.length <= 0 ||
      !body.description ||
      body.description.length <= 0
    ) {
      return new Response("Bad request", { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        name: body.name,
        description: body.description,
        userId: session.user?.id ?? "",
      },
    });

    return Response.json(store);
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
