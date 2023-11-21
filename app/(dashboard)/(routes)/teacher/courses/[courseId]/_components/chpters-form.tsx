"use client";
import { Loader2, Pencil, PlusCircle, PlusIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import ChaptersList from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is Required" }),
});

interface ChapterFormProps {
  intialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChapterForm = ({ intialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState<Boolean>(false);
  const [isUpdating, setIsUpdating] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(`/api/courses/${courseId}/chapters`, values);

      router.refresh();
      toggleCreating();
      toast.success("Chapter");
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });

      router.refresh();
      toast.success("chapters reordered successfull");
    } catch (err) {
      toast.error("something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  const toggleCreating = () => {
    setIsCreating((present) => !present);
  };

  return (
    <div className="mt-6 p-4 bg-slate-100 rounded-sm relative">
      {isUpdating && (
        <div className="absolute bg-slate-500/20 left-0 top-0 right-0 h-full w-full flex items-center justify-center">
          <Loader2 className="animate-spin w-6 h-6 text-sky-700" /> 
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="eg => Introduction to the course..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !intialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!intialData.chapters?.length && "No Chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={intialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <div className="mt-2 text-slate-500">
          Drag and drop to reorder the chapters
        </div>
      )}
    </div>
  );
};

export default ChapterForm;
