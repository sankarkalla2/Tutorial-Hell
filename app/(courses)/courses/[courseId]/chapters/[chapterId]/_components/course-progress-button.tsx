"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CouseProgressButtonProps {
  isCompleted: boolean;
  courseId: string;
  chapterId?: string;
  nextChapterId?: string;
}

const CourseProgressButton = ({
  isCompleted,
  courseId,
  chapterId,
  nextChapterId,
}: CouseProgressButtonProps) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("progress updated");
      router.refresh();
    } catch (err: any) {
      console.log(err.message);
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
      onClick={onClick}
      disabled={isLoading}
    >
      {isCompleted ? "Mark as not Complete" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
