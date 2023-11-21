"use client";

import { File, ImageIcon, Loader, Pencil, PlusCircle, X } from "lucide-react";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/upload-file";
import prisma from "@/lib/db";

const formSchema = z.object({
  url: z.string().min(1),
});

interface AttachMentFormProps {
  intialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachMentForm = ({ intialData, courseId }: AttachMentFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (url: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `/api/courses/${courseId}/attachments`,
        url
      );

      router.refresh();
      toggleEdit();
      toast.success("file attchement created successfull");
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  const toggleEdit = () => {
    setIsEditing((present) => !present);
  };

  const onDelete = async (attachmentId: string) => {
    try {
      setIsDeletingId(attachmentId);

      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachmentId}`
      );

      toast.success("file deleted successfull");
      router.refresh()
    } catch (err) {
      toast.error("something went wrong while deleting file");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="mt-6 p-4 bg-slate-100 rounded-sm">
      <div className="font-medium flex items-center justify-between">
        File Attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && intialData.attachments.length === 0 && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" /> Add File
            </>
          )}
          {!isEditing && intialData.attachments.length > 0 && (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit File
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (intialData.attachments.length === 0 ? (
          <p className="text-sm mt-2 text-slate-500">
            No attachemets are founded yet
          </p>
        ) : (
          <>
            {intialData.attachments.map((attachment) => (
              <div
                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-sm"
                key={attachment.id}
              >
                <File className="w-4 h-4 mr-2 flex-shrink-0 ml-auto" />
                <p className=" text-sm line-clamp-1">{attachment.name}</p>
                {isDeletingId === attachment.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <X
                    className="w-4 h-4 hover:opacity-75 transition ml-auto cursor-pointer"
                    onClick={() => onDelete(attachment.id)}
                  />
                )}
              </div>
            ))}
          </>
        ))}
      {isEditing && (
        <FileUpload
          endpoint="courseAttachment"
          onChange={(url: string) => {
            if (url) {
              onSubmit({ url: url });
            }
          }}
        />
      )}
    </div>
  );
};

export default AttachMentForm;
