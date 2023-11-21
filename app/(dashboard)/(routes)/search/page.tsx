import prisma from "@/lib/db";
import Categories from "./_comonents/categories";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseList from "./_comonents/course-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const Search = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId, ...searchParams });

  return (
    <div className="p-6 space-y-6">
      <Categories items={categories} />
      <CourseList items={courses} />
    </div>
  );
};

export default Search;
