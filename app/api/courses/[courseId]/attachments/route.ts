import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const PATCH = async (
  request: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { url } = await request.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("You are unouthrized", { status: 401 });
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!owner) {
      return new NextResponse(
        "You are allowed to interference in others courses",
        { status: 401 }
      );
    }

    const attachment = await prisma.attachment.create({
      data: {
        url: url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });


    return NextResponse.json(attachment, { status: 200 });
  } catch (err) {
    return new NextResponse("Server Error", { status: 500 });
  }
};
