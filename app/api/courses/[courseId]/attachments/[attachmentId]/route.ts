import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import AttachMentForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachment-form";

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) => {
  try {
    const { userId } = auth();
    const courseOwner = await prisma.attachment.findUnique({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    if (!userId || !courseOwner) {
      return new NextResponse("Your are unouthrized", { status: 401 });
    }

    const attachment = await prisma.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (err) {
    console.log("Attchement ", err);
    return new NextResponse("Server Error", { status: 500 });
  }
};
