"use client";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterAccessFormProps {
  initialData: Chapter
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({ initialData, courseId , chapterId }: ChapterAccessFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: Boolean(initialData.isFree),
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
        Chapter Access Settings
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <div>cancel</div>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditting && <p className={cn(
        "text-sm mt-2",
        !initialData.isFree &&"text-slate-500 italic"
      )}>
        {initialData.isFree ? (
          <>
            This Chapter is Free For Preview.
          </>
        ):(
          <>
          This Chapter is not Free For Preview.
          </>
        )}
      </p>}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center flex-row space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want this chapter free for preview
                      </FormDescription>
                    </div>
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

export default ChapterAccessForm;
