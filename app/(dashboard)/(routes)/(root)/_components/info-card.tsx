import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface InfoCardProps {
  variant?: "default" | "success";
  label: string;
  noOfItems: number;
  icon: LucideIcon;
}

const InfoCard = ({ variant, label, noOfItems, icon: Icon }: InfoCardProps) => {
  return (
    <div className="flex items-center border gap-x-2 p-1">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <h2 className="font-medium">{label}</h2>
        <p className="text-slate-500 text-sm">
          {noOfItems} {noOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
