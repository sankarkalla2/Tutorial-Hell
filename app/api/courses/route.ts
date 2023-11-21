import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export const POST = async (req: Request) => {
  const { title } = await req.json();
  const { userId } = auth();

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ massage: err }), { status: 500 });
  }
};
