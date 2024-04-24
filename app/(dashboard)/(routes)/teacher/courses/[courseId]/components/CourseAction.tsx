"use client";

import ConfirmModel from "@/components/models/ConfirmModel";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}
const CourseAction = ({
  courseId,
  isPublished,
  disabled,
}: CourseActionProps) => {
    const [isLoading , setIsLoading] = useState(false)
    const router = useRouter();
    const confetti = useConfettiStore()
    const onClick = async () => {
        try {
            setIsLoading(true)
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Course unPublished successfully");
            }else{
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course Published successfully");
                confetti.setOpen()
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
          await axios.delete(`/api/courses/${courseId}`);
          toast.success("Course Delete successfully");
          router.refresh();
          router.push(`/teacher/courses`)
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

export default CourseAction;
