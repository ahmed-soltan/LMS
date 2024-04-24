"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
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
  playbackId: string;
  isBlocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  courseId,
  title,
  nextChapterId,
  playbackId,
  isBlocked,
  completeOnEnd,
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
        router.push(`/courses/${courseId}/chapters/${chapterId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again");
    } finally {
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

      {!isBlocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          playbackId={playbackId}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
