import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseList from "../search/_comonents/course-list";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";

const page = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { completedCourses, courseInProgess } = await getDashboardCourses(
    userId
  );

  console.log(courseInProgess);
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          noOfItems={courseInProgess.length}
        />

        <InfoCard
          icon={CheckCircle}
          label="Completed"
          variant="success"
          noOfItems={completedCourses.length}
        />
      </div>

      <CourseList items={[...courseInProgess, ...completedCourses]} />
    </div>
  );
};

export default page;
