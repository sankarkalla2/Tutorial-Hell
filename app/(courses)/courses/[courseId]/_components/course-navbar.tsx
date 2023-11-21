import NavbarRoutes from "@/app/(dashboard)/_components/NavbarRoutes";
import CourseMobileMenu from "./course-mobile-menu";

const CourseNavbar = ({ course, progressCount }: any) => {
  return (
    <div className="ml-auto py-4 bg-white flex border-b items-center px-4">
      <CourseMobileMenu course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
