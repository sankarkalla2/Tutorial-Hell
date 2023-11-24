import { getProgress } from "@/actions/user-progress";
import SideBar from "@/app/(dashboard)/_components/sidebar";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "./_components/Sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayotPage = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/");


  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          postion: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  const progressCount = await getProgress(userId, params.courseId);
  return (
    <div className="">
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar course={course} progressCount={progressCount} />
        </div>
        <div className="hidden md:flex flex-col fixed inset-y-0 w-80 z-50">
          <Sidebar course={course} progressCount={progressCount} />
        </div>
      </div>
      <main className="md:pl-80 h-full">{children}</main>
    </div>
  );
};

export default CourseLayotPage;
