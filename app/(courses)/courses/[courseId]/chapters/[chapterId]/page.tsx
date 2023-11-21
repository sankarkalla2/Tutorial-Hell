import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import VidoePlayer from "./_components/video-player";
import { title } from "process";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Priview } from "@/components/preview";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseProgressButton from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    userProgress,
    purchase,
    muxData,
    attachments,
    nextChapter,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="mt-[80px]">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You are already completed this chapter"
        />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="you need to puchase this course to watch."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto relative z-0">
        <div className="p-4">
          <VidoePlayer
            chapterId={params.chapterId}
            nextChapter={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            courseId={params.courseId}
            completeOnEnd={completOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col items-center md:flex-row md:justify-between">
          <h2 className="text-3xl font-semibold pb-2">{chapter.title}</h2>
          {purchase ? (
            <div className="self-stretch md:self-end">
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={params.courseId}
                isCompleted={!!userProgress?.isCompleted}
                nextChapterId={nextChapter?.id}
              />
            </div>
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
              userId={userId}
            />
          )}
        </div>
        <Separator />
        <div>
          <Priview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <div className="p-4">
            <Separator />
            <h1 className="text-xl font-semibold mt-2">Attachments</h1>
            <div className="">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center gap-x-2 w-full bg-sky-200/40 text-sky-700 rounded-md shadow-sm mt-2 p-1 underline hover:text-blue-600"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
