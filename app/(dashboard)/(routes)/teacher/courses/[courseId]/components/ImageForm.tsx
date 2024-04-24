"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting && <div>cancel</div>}
          {!isEditting && !initialData?.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
          {!isEditting && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditting && !initialData?.imageUrl && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {isEditting && !initialData?.imageUrl && (
        <div className="mb-4">
          <p className="text-sm text-slate-600">No Image Has Been Selected</p>
        </div>
      )}
      {!isEditting && initialData?.imageUrl && (
        <div className="relative aspect-video mt-2">
          <Image
            src={initialData?.imageUrl}
            alt="Current image"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 Aspect Ratio is Recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
