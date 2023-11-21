import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

const CourseList = ({ items }: CourseListProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4">
      {items.map((item) => (
        <CourseCard
          key={item.id}
          id={item.id}
          title={item.title}
          imageUrl={item?.imageUrl!}
          chaptersLength={item.chapters.length!}
          price={item.price!}
          progress={item.progress!}
          category={item?.category?.name!}
        />
      ))}
    </div>
  );
};

export default CourseList;
