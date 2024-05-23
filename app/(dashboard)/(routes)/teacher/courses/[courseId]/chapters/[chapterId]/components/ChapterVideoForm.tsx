"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string(),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditting(!isEditting);
  };
  const onSubmit = async (data:string) => {
    console.log(data);
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {videoUrl:data});
      toast.success("Chapter updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting && <div>cancel</div>}
          {!isEditting && !initialData?.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}
          {!isEditting && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditting && !initialData?.videoUrl && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {isEditting && !initialData?.videoUrl && (
        <div className="mb-4">
          <p className="text-sm text-slate-600">No Video Has Been Selected</p>
        </div>
      )}
      {!isEditting && initialData?.videoUrl && (
        <div className="relative aspect-video mt-2">
          <video className="w-full rounded-md h-full" controls>
            <source src={initialData?.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="ChapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit(url);
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this Chapter&apos;s Video.
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditting && (
        <p className="text-sm text-muted-foreground mt-2">
          Videos Can Take Few minutes to process. Refresh the page if the video
          does not appear.
        </p>
      )}
    </div>
  );
};

export default ChapterVideoForm;
