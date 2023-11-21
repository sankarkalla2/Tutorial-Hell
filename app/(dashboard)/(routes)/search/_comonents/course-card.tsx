import CourseProgress from "@/app/(courses)/courses/[courseId]/_components/course-progress";
import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/currency-format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  imageUrl: string;
  title: string;
  chaptersLength: number;
  price: number;
  progress: number;
  category: string;
}
const CourseCard = ({
  id,
  imageUrl,
  title,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <div>
      <Link href={`/courses/${id}`}>
        <div className="hover:shadow-md transition overflow-hidden border rounded-lg p-3 w-80 h-full">
          <div className="rounded-md overflow-hidden relative aspect-video">
            <Image alt={title} className="object-cover" src={imageUrl} fill />
          </div>
          <div className="flex flex-col my-3 ">
            <div className="text-xl hover:text-sky-500 font-medium md:text-base transion line-clamp-2">
              {title}
            </div>
            <div className="text-xs text-muted-foreground">{category}</div>
            <div className="flex items-center gap-x-1 text-slate-500 py-2">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {" "}
                {chaptersLength}
                {chaptersLength == 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
            <div className="font-medium">
              {progress !== null ? (
                <div>
                  <CourseProgress
                    value={progress}
                    variant={progress === 100 ? "success" : "default"}
                  />
                </div>
              ) : (
                <p>{formatPrice(price)}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
