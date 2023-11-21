import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();
    if (!userId) {
      return new NextResponse("you are not authrized", { status: 400 });
    }

    // const chapter = await prisma.chapter.findUnique({
    //   where: {
    //     id: params.chapterId,
    //   },
    // });

    // if (!chapter) {
    //   return new NextResponse("chater not found", { status: 404 });
    // }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        chapterId: params.chapterId,
        isCompleted,
        userId,
      },
    });

    return NextResponse.json(userProgress, { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return new NextResponse("Internel server error:", { status: 500 });
  }
};
