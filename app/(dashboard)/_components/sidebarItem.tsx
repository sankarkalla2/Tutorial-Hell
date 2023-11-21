"use client";
import { LucideIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItermProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
const SideBarItem = ({ icon: Icon, label, href }: SidebarItermProps) => {
  const pathname: string = usePathname();
  const router: AppRouterInstance = useRouter();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={() => onClick()}
      type="button"
      className={cn(
        "flex flex-center gap-x-3 text-slate-500 text-sm font-[500] pl-8 transition-all hover:text-slate-800",
        isActive &&
          "text-sky-600 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center py-6 gap-x-2">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-sky-600 hover:text-sky-700"
          )}
        />
        {label}
        <div
          className={cn(
            "absolute right-0 opacity-0 border-sky-700 h-8 transition-all border-2",
            isActive && "opacity-100"
          )}
        />
      </div>
    </button>
  );
};

export default SideBarItem;
