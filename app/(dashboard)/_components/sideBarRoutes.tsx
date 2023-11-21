"use client";
import { Layout, Compass, List, BarChart } from "lucide-react";
import SideBarItem from "./sidebarItem";
import { usePathname } from "next/navigation";

const guestRouts = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];
const SideBarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRouts;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SideBarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SideBarRoutes;
