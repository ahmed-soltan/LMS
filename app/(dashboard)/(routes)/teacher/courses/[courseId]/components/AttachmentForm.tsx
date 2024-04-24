"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";

interface AttachmentFormProps {
  initialData: Course & { attachment: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "image is required",
  }),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attacment Delete successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachment
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting && <div>cancel</div>}
          {!isEditting && initialData?.attachment.length === 0 && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Edit Course Attachment
            </>
          )}
          {!isEditting && initialData?.attachment.length > 0 && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Course Attachment
            </>
          )}
        </Button>
      </div>
      {!isEditting && initialData?.attachment.length === 0 && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <p className="text-sm mt-2 text-slate-500 italic">No Attchments</p>
        </div>
      )}
      {initialData?.attachment.length > 0 && (
        <div className="space-y-2">
          {initialData?.attachment.map((attachment, index) => (
            <div
              className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
              key={index}
            >
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>
              </div>
              <div>
                {deletingId === attachment.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {deletingId !== attachment.id && (
                  <button
                    className="ml-auto hover:opacity-75 transition"
                    onClick={() => onDelete(attachment.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {isEditting && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add any thing your Student might need to complete you course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
