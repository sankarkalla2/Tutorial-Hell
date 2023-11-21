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
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/currency-format";

const formSchema = z.object({
  price: z.coerce.number(),
});

interface PriceFormProps {
  intialData: Course;
  courseId: string;
}

const PriceForm = ({ intialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: intialData.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/courses/${courseId}`,
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
        Course Price
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          {(intialData.price && formatPrice(intialData.price)) || "No Price"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      step="0.01"
                      placeholder="Set a price to your course"
                      {...field}
                    />
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

export default PriceForm;
