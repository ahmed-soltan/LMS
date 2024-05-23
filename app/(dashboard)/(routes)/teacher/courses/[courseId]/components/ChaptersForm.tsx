"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ChapterList from "./ChapterList";

interface ChaptersFormProps {
  initialData:Course & {chapters :Chapter[]}
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "title is required",
  }),
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isCreating , setIsCreating] = useState(false);
  const [isUpdating , setIsUpdating] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title:"",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    
    try {
        await axios.post(`/api/courses/${courseId}/chapters` , data);
        toast.success("Chapter Created successfully");
        toggleCreating();
        router.refresh()
    } catch (error) {
        toast.error("something went wrong")
    }finally{
      form.reset()
    }
  };

  const onReorder=async(updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder` , {
        list:updateData
      })
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id:string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }


  return (
    <div className="relative mt-6 bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center bg-slate-200 opacity-50 rounded-md">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? (
            <div>cancel</div>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Add a Chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
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
                    <FormLabel>Course title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        {...field}
                        placeholder="e.g. 'Introduction to The Course'"
                      />
                    </FormControl>
                    <FormMessage/>
           
                  </FormItem>
                );
              }}
            />
                <Button type="submit" disabled={isSubmitting || !isValid}>
                    Create
                </Button>
          </form>
        </Form>
      )}
      {!isCreating &&(
        <div className={cn(
          "text-sm mt-2",
          !initialData?.chapters.length && "text-slate-500 italic"
        )}>{!initialData?.chapters.length && "No Chapters" }
        <ChapterList 
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData?.chapters || []}
        />
        </div>
      )}
      {!isCreating &&(
        <p className="text-sm text-muted-foreground mt-4">Drap and drop to reorder chapters</p>
      )}
    </div>
  );
};

export default ChaptersForm;
