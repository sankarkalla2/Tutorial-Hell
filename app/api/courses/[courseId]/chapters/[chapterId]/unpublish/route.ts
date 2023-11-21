import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("you are unauthrized", { status: 401 });
    }

    const isCourseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!isCourseOwner)
      return new NextResponse("you are not authrized", { status: 401 });

    await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const chapters = await prisma.chapter.findMany({
      where: {
        courseId: params.courseId,
      }
    })

    const publishedChapters = chapters.every(chapter => chapter.isPublished);
    
    if(!publishedChapters) {
      await prisma.course.update({
        where: {
          id: params.courseId,
          userId
        },
        data: {
          isPublished: false
        }
      })
    }

    return new NextResponse("your course is unpublished", { status: 200 });
  } catch (err) {
    return new NextResponse("Internel server error", { status: 500 });
  }
};
