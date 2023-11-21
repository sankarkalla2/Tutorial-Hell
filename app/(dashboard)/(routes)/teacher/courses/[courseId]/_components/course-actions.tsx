"use client";

import { ConfirmModal } from "@/components/alter-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionProps {
  isPublished: boolean;
  courseId: string;
  isCompleted: boolean;
}

const CourseActions = ({
  isCompleted,
  isPublished,
  courseId,
}: CourseActionProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const handlePublish = async () => {
    try {
      setIsUpdating(true);
      if (isPublished) {
        const res = await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("your course unpublished successfully");
      } else {
        const res = await axios.patch(`/api/courses/${courseId}/publish`);
        console.log(res.data);
        toast.success("your course is successfully published");
        // confetti.onOpen();
      }

      router.refresh();
    } catch (err) {
      toast.error("something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsUpdating(true);

      await axios.delete(`/api/courses/${courseId}`);
      router.refresh();
      router.push("/teacher/create");
      toast.success(`your course deleted successfully`);
    } catch (err) {
      toast.error("something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!isCompleted || isUpdating}
          onClick={handlePublish}
        >
          {isPublished ? "unpublish" : "publish"}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
          <Button size="sm" disabled={isUpdating}>
            <Trash2 className="w-5 h-5" />
          </Button>
        </ConfirmModal>
      </div>
    </div>
  );
};

export default CourseActions;
