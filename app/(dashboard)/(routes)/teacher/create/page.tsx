"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title Required" }),
});

const Create = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post("/api/courses", values);

      toast.success(
        `your course ${res.data.title} has been successfull created`
      );
      router.push(`/teacher/courses/${res.data.id}`);
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    }
  };
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-[80vh] p-6 w-full">
      <div>
        <h1 className="text-2xl">Name Your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Dont Worry, You can this
          change later
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Advanced backend devlopment"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Link href="/">
                <Button variant="ghost" type="button" className="mx-2">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Create;
