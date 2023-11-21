"use client";

import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";

interface CourseSidebarItemProps {
  id: string;
  courseId: string;
  isLocked: boolean;
  label: string;
  isCompleted: boolean;
}

const CourseSidebarItem = ({
  id,
  courseId,
  isLocked,
  label,
  isCompleted,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname.includes(id);
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 font-[500] hover:bg-slate-200/20 pl-6 hover:text-slate-700 transition text-base",
        isCompleted && "text-sky-500 bg-emerald-200/20",
        isActive && "bg-slate-200/20 border-r-4 border-sky-900",
        isActive && isCompleted && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon />
        {label}
      </div>
    </button>
  );
};

export default CourseSidebarItem;
