"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";

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
          onEnded={() => {}}
          autoPlay
          src={videoUrl}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
