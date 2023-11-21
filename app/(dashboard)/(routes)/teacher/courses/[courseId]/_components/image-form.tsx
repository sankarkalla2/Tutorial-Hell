"use client";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/upload-file";

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image Url is required" }),
});

interface ImageFormProps {
  intialData: Course;
  courseId: string;
}

const ImageForm = ({ intialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `/api/courses/${courseId}`,
        values
      );

      router.refresh();
      toggleEdit();
      toast.success(res.data);
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
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !intialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Image
            </>
          )}
          {!isEditing && intialData.imageUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!intialData?.imageUrl ? (
          <div className="flex flex-center items-center justify-center h-60 bg-slate-200 rounded-sm">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-sm"
              src={intialData.imageUrl || ""}
            />
          </div>
        ))}
      {isEditing && (
        <FileUpload
          endpoint="courseImage"
          onChange={(url: string) => {
            if (url) {
              onSubmit({ imageUrl: url });
            }
          }}
        />
      )}
      <div className="text-xs text-muted-foreground mt-4">
        16:9 aspect ration reccomended
      </div>
    </div>
  );
};

export default ImageForm;
