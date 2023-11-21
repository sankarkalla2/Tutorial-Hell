import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByvariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress = ({ value, variant, size }: CourseProgressProps) => {
  return (
    <div>
      <Progress value={value} variant={variant} className="h-2" />
      <p
        className={cn(
          "font-medium text-sky-700 mt-2",
          colorByvariant[variant || "default"],
          sizeByVariant["default"]
        )}
      >
        {Math.round(value)}% Completed
      </p>
    </div>
  );
};

export default CourseProgress;
