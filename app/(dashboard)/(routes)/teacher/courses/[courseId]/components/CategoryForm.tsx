"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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

interface CategoryFormProps {
  initialData: {
    categoryId: string | null;
  };
  courseId: string;
  options:{
    label:string,
    value:string
  }[]
}

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "description is required",
  }),
});

const CategoryForm = ({ initialData, courseId , options}: CategoryFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/courses/${courseId}` , data);
        toast.success("Course updated successfully");
        toggleEdit();
        router.refresh()
    } catch (error) {
        toast.error("something went wrong")
    }
  };
  const selectedOption = options.find((option) => option.value===initialData.categoryId)

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <div>cancel</div>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Category
            </>
          )}
        </Button>
      </div>
      {!isEditting && <p className={cn(
        "text-sm mt-2",
        !initialData.categoryId &&"text-slate-500 italic"
      )}>{selectedOption?.label || "No Description"}</p>}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                     <Combobox {...field}  options={options} />
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

export default CategoryForm;
