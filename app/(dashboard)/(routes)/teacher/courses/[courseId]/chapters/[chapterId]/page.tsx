import { IconBadge } from "@/components/icon-badge";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { boolean } from "zod";
import ChapterTitleForm from "./__componets/title-form";
import ChapterDescriptionForm from "./__componets/descripton-form";
import DescriptionForm from "../../_components/description-form";
import ChapterAccessForm from "./__componets/chapter-access-form";
import ChapterVideoForm from "./__componets/chapter-video-form";
import { Banner } from "@/components/banner";
import ChapterActions from "./__componets/chapter-action";

const Chapter = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const completedFields = requiredFields.filter(Boolean).length;
  const completedText = `(${completedFields}/${requiredFields.length})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is uppublished. It will not visible in course"
        />
      )}
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="text-sm hover:opacity-75 flex items-center mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back To Course
          </Link>

          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-slate-700 text-sm">
                Complete all fields {completedText}
              </span>
            </div>
            <ChapterActions disabled={!isComplete} courseId={params.courseId} chapterId={params.chapterId} isPublished={chapter.isPublished} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-semibold">Customize your chapters</h2>
          </div>

          <ChapterTitleForm
            intialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
          <ChapterDescriptionForm
            intialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Eye} />
            <h2 className="font-semibold text-xl">Access Settings</h2>
          </div>

          <ChapterAccessForm
            intialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl font-semibold">Add Video</h2>
          </div>
          <ChapterVideoForm
            intialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>
      </div>
    </div>
  );
};

export default Chapter;
