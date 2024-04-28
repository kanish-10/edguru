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
import {
  deleteCourse,
  publishCourse,
  unpublishCourse,
} from "@/action/courses.action";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId?: string;
  isPublished: boolean;
  type: "chapter" | "course";
}

const PublishActions = ({
  disabled,
  chapterId,
  isPublished,
  courseId,
  type,
}: ChapterActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [loading, setLoading] = useState(false);
  const onDeleteChapter = async () => {
    try {
      setLoading(true);
      if (chapterId) await deleteChapter({ courseId, chapterId });
      toast({ title: "Chapter deleted" });
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const onDeleteCourse = async () => {
    try {
      setLoading(true);
      await deleteCourse({ courseId });
      toast({ title: "Course deleted" });
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const chapterPublish = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        if (chapterId) await unpublishChapter({ courseId, chapterId });
        toast({ title: "Chapter unpublished" });
        router.refresh();
      } else {
        if (chapterId) await publishChapter({ courseId, chapterId });
        toast({ title: "Chapter published" });
        router.refresh();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const coursePublish = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        await unpublishCourse({ courseId });
        toast({ title: "Course unpublished" });
        router.refresh();
      } else {
        await publishCourse({ courseId });
        toast({ title: "Course published" });
        confetti.onOpen();
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
        onClick={type === "chapter" ? chapterPublish : coursePublish}
        disabled={disabled || loading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={type === "chapter" ? onDeleteChapter : onDeleteCourse}
      >
        <Button size="sm" disabled={loading}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default PublishActions;
