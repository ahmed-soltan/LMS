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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course Created Successfully");
    } catch {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:items-center md:justify-center h-full p-6 relative">
      <div>
        <h1 className="text-2xl">Name Your Course</h1>
        <p className="text-sm text-slate-500">
          What Would You Name your course, Don&apos;t Your Can Change it Later
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Advanced web Development'"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you Teach in this Course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex items-center gap-x-2">
            <Link href={"/"}>
              <Button size={"sm"} variant={"ghost"}>
                Cancel
              </Button>
            </Link>
            <Button
              size={"sm"}
              type={"submit"}
              variant={"default"}
              disabled={isSubmitting || !isValid}
              className="ml-auto"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourse;
