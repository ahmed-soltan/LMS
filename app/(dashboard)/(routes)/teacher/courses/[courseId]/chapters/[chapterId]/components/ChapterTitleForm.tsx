"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const ChapterTitleForm = ({ initialData, courseId , chapterId }: ChapterTitleFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}` , data);
        toast.success("Chapter updated successfully");
        toggleEdit();
        router.refresh()
    } catch (error) {
        toast.error("something went wrong")
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Title
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <div>cancel</div>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditting && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Chapter Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        {...field}
                        type="text"
                        placeholder="e.g. 'Advanced web Development'"
                      />
                    </FormControl>
                    <FormMessage/>
           
                  </FormItem>
                );
              }}
            />
            <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={isSubmitting || !isValid}>
                    Save
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterTitleForm;
