import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_SECRET_ID!,
)

export const PATCH = async (
  request: Request,
  { params }: { params: { courseId: string } }
) => {
  const { userId } = auth();
  const { courseId } = params;
  const values = await request.json();

  if (!userId) {
    return new NextResponse("Your Are Not Authorized", { status: 401 });
  }

  try {
    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return new NextResponse("successfully updated", { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { massage: "your are not allowed" },
      { status: 200 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId)
      return new NextResponse("your are unauthrized", { status: 401 });

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course)
      return new NextResponse("course not found", { status: 401 });

    for(let chapter of course.chapters) {
      if(chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
        
      }
    }

   await prisma.course.delete({
      where: {
        id: params.courseId,
        userId,
      },
    });
    return new NextResponse("your course deleted successfully", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse("internel server error", { status: 500 });
  }
};
