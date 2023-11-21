import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("your are unauthrized", { status: 401 });
    }
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Your are unauthrized", { status: 401 });
    }

    // main
    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        postion: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.postion + 1 : 1;

    const chapter = await prisma.chapter.create({
      data: {
        postion: newPosition,
        title,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(chapter, { status: 200 });
  } catch (err) {
    return new NextResponse("Server Error", { status: 500 });
  }
};
