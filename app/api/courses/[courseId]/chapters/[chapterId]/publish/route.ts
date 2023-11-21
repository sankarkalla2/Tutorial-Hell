import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId)
      return new NextResponse("you are not authrized", { status: 401 });

    const isCourseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!isCourseOwner) {
      return new NextResponse("you are not allowed to do this", {
        status: 401,
      });
    }

    const chapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return new NextResponse("chapter successfully published", { status: 200 });
  } catch (err) {
    return new NextResponse("Internel server error", { status: 500 });
  }
};
