import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { list } = await req.json();
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
      return new NextResponse("you are not unauthrized", { status: 200 });
    }

    for (let item of list) {
      await prisma.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          postion: item.position,
        },
      });
    }

    return new NextResponse("chapters updated  successfully", { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internel Server Error", { status: 500 });
  }
};
