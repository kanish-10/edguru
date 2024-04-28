"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  deleteChapter,
  publishChapter,
  unpublishChapter,
} from "@/action/chapters.action";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled,
  chapterId,
  isPublished,
  courseId,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteChapter({ courseId, chapterId });
      toast({ title: "Chapter deleted" });
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        await unpublishChapter({ courseId, chapterId });
        toast({ title: "Chapter unpublished" });
        router.refresh();
      } else {
        await publishChapter({ courseId, chapterId });
        toast({ title: "Chapter published" });
        router.refresh();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={loading}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
