import prisma from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./user-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  courseInProgess: CourseWithProgressWithCategory[];
};
export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    console.log(purchasedCourses);

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const courseInProgess: CourseWithProgressWithCategory[] = courses.filter(
      (course) => course.progress !== 100
    );

    return {
      completedCourses,
      courseInProgess,
    };
  } catch (err) {
    console.log(err);
    return {
      completedCourses: [],
      courseInProgess: [],
    };
  }
};
