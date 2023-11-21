import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("you are not authrized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) return new NextResponse("You are not authenticated");

    const upDatedCourse = await prisma.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(upDatedCourse, { status: 200 });
  } catch (err) {
    return new NextResponse("Internel server error", { status: 500 });
  }
};
