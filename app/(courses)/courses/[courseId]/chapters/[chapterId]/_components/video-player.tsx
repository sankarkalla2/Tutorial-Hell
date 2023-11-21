"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { title } from "process";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  chapterId: string;
  courseId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  nextChapter?: string;
  playbackId?: string;
}
const VidoePlayer = ({
  chapterId,
  nextChapter,
  isLocked,
  completeOnEnd,
  playbackId,
  courseId,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(true);
  const router = useRouter();
  const confetti = useConfettiStore();
  const onEnded = async () => {
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: true }
      );

      if (!nextChapter) {
        confetti.onOpen();
      }
      if (nextChapter) {
        router.push(`/courses/${courseId}/chapters/${nextChapter}`);
      }

      toast.success("progress updated");
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute z-0 inset-0 bg-slate-800 flex items-center justify-center">
          <Loader2 className="animate-spin w-8 text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute flex z-0 inset-0 flex-col gap-x-2 text-secondary text-sm items-center justify-center bg-slate-800">
          <Lock />
          <p>You need to purchase this course to watch.</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          playbackId={playbackId}
          onEnded={onEnded}
          autoPlay
          onCanPlay={() => setIsReady(true)}
        />
      )}
    </div>
  );
};

export default VidoePlayer;
