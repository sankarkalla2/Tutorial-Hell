import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          postion: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/search");
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
