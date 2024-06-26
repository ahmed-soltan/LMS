"use client";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "description is required",
  }),
});

const ChapterDescriptionForm = ({ initialData, courseId , chapterId }: ChapterDescriptionFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}` , data);
        toast.success("Course updated successfully");
        toggleEdit();
        router.refresh()
    } catch (error) {
        toast.error("something went wrong")
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter description
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <div>cancel</div>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditting && <div className={cn(
        "text-sm mt-2",
        !initialData.description &&"text-slate-500 italic"
      )}>
        {!initialData.description && "No Description"}
        {initialData.description && (
          <Preview
            value={initialData.description}
          />
        )}
      </div>}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Chapter Description</FormLabel>
                    <FormControl>
                      <Editor
                        {...field}
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

export default ChapterDescriptionForm;
