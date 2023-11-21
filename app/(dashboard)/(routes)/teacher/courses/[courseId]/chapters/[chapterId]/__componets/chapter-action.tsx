"use client";

import { ConfirmModal } from "@/components/alter-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChapterActionProps {
  disabled: boolean;
  isPublished: boolean;
  courseId: string;
  chapterId: string;
}

const ChapterActions = ({
  disabled,
  isPublished,
  courseId,
  chapterId,
}: ChapterActionProps) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const onClick = async () => {
    setIsUpdating(true);
    if (isPublished) {
      try {
        const res = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );

        router.refresh();
        toast.success("chapter unpublished successfully");
      } catch (err) {
        toast.error("something went wrong");
      }
    } else {
      try {
        const res = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );

        router.refresh();
        toast.success("chapter published successfully");
      } catch (err) {
        toast.error("something went wrong");
      }
    }
    setIsUpdating(false);
  };
  const onDelete = async () => {
    try {
      setIsUpdating(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
      toast.success("chapter deleted successfully");
    } catch (err) {
      toast.error("something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isUpdating}
        variant="outline"
        size="sm"
        onClick={onClick}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" variant="destructive">
          <Trash2 />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
