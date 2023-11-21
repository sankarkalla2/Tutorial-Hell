import { IconBadge } from "@/components/icon-badge";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  LucideCircleDashed,
  Trash2,
} from "lucide-react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachMentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chpters-form";
import { boolean } from "zod";
import { Banner } from "@/components/banner";
import { Button } from "@/components/ui/button";
import CourseActions from "./_components/course-actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          postion: "asc",
        },
      },
    },
  });

  const categories = await prisma.category.findMany();

  if (!userId) {
    redirect("/");
  }
  if (!course) {
    redirect("/");
  }

  const requiredFileds = [
    course.title,
    course.description,
    course.categoryId,
    course.price,
    course.imageUrl,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFileds.length;
  const completedFields = requiredFileds.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFileds.every(Boolean);
  return (
    <div className="p-6">
      {!course.isPublished && (
        <Banner
          label="this course is not visible in courses untill you published"
          variant="warning"
        />
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xl font-medium">
          <h1>Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <CourseActions
          isPublished={course.isPublished}
          courseId={params.courseId}
          isCompleted={isCompleted}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your course</h2>
          </div>
          <TitleForm intialData={course} courseId={params.courseId} />
          <DescriptionForm intialData={course} courseId={params.courseId} />
          <ImageForm intialData={course} courseId={params.courseId} />
          <CategoryForm
            intialData={course}
            courseId={params.courseId}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div>
              <ChapterForm intialData={course} courseId={params.courseId} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your Course</h2>
            </div>
            <PriceForm intialData={course} courseId={params.courseId} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">File Attachments</h2>
            </div>
            <AttachMentForm intialData={course} courseId={params.courseId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
