"use client";

import * as z from "zod";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "@/components/ui/use-toast";
import { updateChapter } from "@/action/chapters.action";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({ courseId, value, chapterId });
      toast({ title: "Video uploaded" });
      toggleEdit();
      router.refresh();
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add an video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="mr-2 size-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="size-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer src={initialData.videoUrl} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url: any) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take few minutes to process. Refresh the page if video does
          not appear
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
