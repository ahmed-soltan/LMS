"use client";

import ConfirmModel from "@/components/models/ConfirmModel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionProps {
  chapterId: string;
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}
const ChapterAction = ({
  chapterId,
  courseId,
  isPublished,
  disabled,
}: ChapterActionProps) => {
    const [isLoading , setIsLoading] = useState(false)
    const router = useRouter();
    const onClick = async () => {
        try {
            setIsLoading(true)
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter unPublished successfully");
            }else{
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter Published successfully");
            }
          router.refresh();
        //   router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
      };
    const onDelete = async () => {
        try {
            setIsLoading(true)
          await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
          toast.success("Chapter Delete successfully");
          router.refresh();
        //   router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
      };
    
  return (
    <div className="flex items-center gap-x-2">
      <Button
        type="submit"
        disabled={disabled || isLoading}
        onClick={onClick}
        size={"sm"}
        variant={"outline"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModel onConfirm={onDelete}>
        <Button disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModel>
    </div>
  );
};

export default ChapterAction;
