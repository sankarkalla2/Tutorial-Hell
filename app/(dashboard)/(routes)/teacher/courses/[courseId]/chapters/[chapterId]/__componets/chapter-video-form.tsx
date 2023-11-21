"use client";

import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Course, Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/upload-file";
import MuxPlayer from "@mux/mux-player-react"


const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
  intialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({
  intialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      router.refresh();
      toggleEdit();
      toast.success("video uploaded successfully");
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  const toggleEdit = () => {
    setIsEditing((present) => !present);
  };
  return (
    <div className="mt-6 p-4 bg-slate-100 rounded-sm">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !intialData.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Video
            </>
          )}
          {!isEditing && intialData.videoUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!intialData?.videoUrl ? (
          <div className="flex flex-center items-center justify-center h-60 bg-slate-200 rounded-sm">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <MuxPlayer playbackId={intialData.muxData?.playbackId || ""} />
        ))}
      {isEditing && (
        <FileUpload
          endpoint="chapterVideo"
          onChange={(url: string) => {
            if (url) {
              onSubmit({ videoUrl: url });
            }
          }}
        />
      )}
      {!isEditing && (
        <div className="text-xs text-muted-foreground mt-4">
          It takes few minutes to process the video.If video does not appeared then refresh the page
        </div>
      )}

      {
        isEditing && (<div className="text-xs mt-4">Upload the video</div>)
      }
    </div>
  );
};

export default ChapterVideoForm;
