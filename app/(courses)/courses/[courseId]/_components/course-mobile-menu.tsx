import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const CourseMobileMenu = ({course, progressCount}:any) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu/>
      </SheetTrigger>
      <SheetContent side='left' className="z-50">
        <Sidebar course={course} progressCount={progressCount}/>
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileMenu;
