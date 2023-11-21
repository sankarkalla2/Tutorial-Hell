import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import Chapter from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/page";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();
    if (!userId) return new NextResponse("Unauthrized", { status: 401 });

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) return new NextResponse("Unauthrized", { status: 401 });

    const chapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    //if video url existed
    if (values.videoUrl) {
      console.log(values.videoUrl);
      const existingMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await prisma.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (err) {
    return new NextResponse("Interner server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId)
      return new NextResponse("you are unauthrized", { status: 401 });

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("you are not authenticated", { status: 401 });

    const chapter = await prisma.chapter.delete({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) return new NextResponse("Not found", { status: 404 });

    if (chapter.videoUrl) {
      const muxData = await prisma.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (muxData) {
        Video.Assets.del(muxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: muxData.id,
          },
        });
      }

      const publishedChapters = await prisma.course.findMany({
        where: {
          id: params.courseId,
          isPublished: true,
        },
      });

      if (!publishedChapters.length) {
        await prisma.course.update({
          where: {
            id: params.courseId,
            userId: userId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }

    return new NextResponse("chapter deleted successfully", { status: 200 });
  } catch (err) {
    return new NextResponse("Internel server error", { status: 500 });
  }
};
