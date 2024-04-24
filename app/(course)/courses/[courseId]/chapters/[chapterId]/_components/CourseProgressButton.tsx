"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}
const CourseProgressButton = ({
  courseId,
  chapterId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isCompleted ? XIcon : CheckCircle;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );
      if (!isCompleted && !nextChapterId) {
        confetti.setOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated successfully");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      type="button"
      variant={isCompleted ? "outline" : "success"}
      disabled={isLoading}
      className="w-full md:w-auto"
      onClick={onClick}
    >
      {isCompleted ? "Not Completed" : "Mark as Completed"}
      <Icon className="w-4 h-4 ml-2 " />
    </Button>
  );
};

export default CourseProgressButton;
