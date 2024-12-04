import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: {
        userId: session.user?.id,
      },
    });

    if (!store) {
      return new Response("Store not found", { status: 404 });
    }

    return Response.json(store);
  } catch (error) {
    console.log("error get store", error);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.description) {
      return new Response("Bad request", { status: 400 });
    }

    const store = await prisma.store.update({
      where: {
        userId: session.user?.id,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return Response.json(store);
  } catch (error) {
    console.log("error updateing the store", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
