"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  chapterId: string;
  courseId: string;
  title: string;
  nextChapterId?: string;
  isBlocked: boolean;
  completeOnEnd: boolean;
  video: string;
}

const VideoPlayer = ({
  chapterId,
  courseId,
  title,
  nextChapterId,
  isBlocked,
  completeOnEnd,
  video,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        if (!nextChapterId) {
          confetti.setOpen();
        }
      }

      toast.success("Progress updated successfully");
      router.refresh();
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again");
    }
  };

  return (
    <div className="relative aspect-video ">
      {!isReady && !isBlocked && (
        <div className="flex items-center justify-center absolute inset-0 bg-slate-800">
          <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
        </div>
      )}
      {isBlocked && (
        <div className="flex items-center justify-center absolute inset-0 bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-10 h-10" />
          <p className="text-sm">This Chapter is Locked</p>
        </div>
      )}

      {!isBlocked && video && (
        <div className="flex flex-col items-center justify-between p-1 w-full max-h-[500px] border-4 border-slate-600 rounded-md">
          <video
            className="w-full rounded-md max-h-[450px]"
            controls
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
