import prisma from "@/lib/db";
import { Chapter, Attachment } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  chapterId: string;
  courseId: string;
}

export const getChapter = async ({ userId, chapterId, courseId }: GetChapterProps) => {

  console.log(userId, chapterId, courseId)
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });
    console.log(course)

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
        courseId,
      },
    });

    if (!chapter && !course) throw new Error("Chapter not found");

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await prisma.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter?.isFree || purchase) {
      muxData = await prisma.muxData.findUnique({
        where: {
          chapterId,
        },
      });

      nextChapter = await prisma.chapter.findFirst({
        where: {
          postion: {
            gt: chapter?.postion,
          },
          isPublished: true,
        },
        orderBy: {
          postion: "asc",
        },
      });
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (err) {
    console.log("ERROR", err);

    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      userProgress: null,
      nextChapter: null,
      purchase: null,
    };
  }
};
