"use client";
import { Pencil } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Priview } from "@/components/preview";

const formSchema = z.object({
  description: z.string().min(1, { message: "Title is Required" }),
});

interface ChapterDescriptionFormProps {
  intialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterDescriptionForm = ({
  intialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: intialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      router.refresh();
      toggleEdit();
      toast.success("chapter description updated successfully");
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
        Chapter Description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Descritpion
            </>
          )}
        </Button>
      </div>
      {!isEditing && !intialData.description && <div>No Description</div>}
      {!isEditing && intialData.description && (
        <div>
          <Priview value={intialData.description} />
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;
