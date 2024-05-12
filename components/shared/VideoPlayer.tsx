"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { toast } from "@/components/ui/use-toast";
import { updateProgress } from "@/action/chapters.action";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  videoUrl: string;
}

const VideoPlayer = ({
  courseId,
  videoUrl,
  chapterId,
  nextChapterId,
  completeOnEnd,
  isLocked,
  title,
}: VideoPlayerProps) => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await updateProgress({
          courseId,
          chapterId,
          isCompleted: true,
        });
        if (!nextChapterId) {
          confetti.onOpen();
        }
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast({ title: "Progress updated" });
        router.refresh();
      }
    } catch (e) {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="relative aspect-video">
      {!ready && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
          <Lock className="size-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!ready && "hidden")}
          onCanPlay={() => setReady(true)}
          onEnded={onEnd}
          autoPlay
          src={videoUrl}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
