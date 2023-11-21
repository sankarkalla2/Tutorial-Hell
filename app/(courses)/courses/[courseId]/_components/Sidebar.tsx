import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "./course-progress";

interface SidebarProps {
  course: Course & {
    chapters: Chapter &
      {
        userProgress: UserProgress[] | null;
      }[];
  };
  progressCount: number;
}

const Sidebar = async ({ course, progressCount }: any) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full w-full items-center border-r flex flex-col overflow-y-auto shadow-sm z-50 relative">
      <div className="p-8 flex flex-col w-full">
        <h1 className="font-semibold text-xl text-sky-700 w-full flex">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress value={progressCount} variant="success" />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full z-50">
        {course?.chapters?.map((chapter: any) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            courseId={course.id}
            isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
            label={chapter.title}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
