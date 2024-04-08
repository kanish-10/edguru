"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { chapterReorder, createChapter } from "@/action/chapters.action";
import ChapterList from "@/components/shared/ChapterList";

const formSchema = z.object({
  title: z.string().min(1),
});

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await createChapter({ courseId, title: value.title });
      toast({ title: "Chapter Created" });
      toggleCreating();
      router.refresh();
    } catch (e) {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setUpdating(true);
      await chapterReorder({ updateData, courseId });
      toast({ title: "Chapter Reorder successfully" });
      router.refresh();
    } catch (e) {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapter/${id}`);
  };

  const toggleCreating = () => {
    setCreating((prev) => !prev);
  };

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {updating && (
        <div className="absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader className="size-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {creating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {creating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!creating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic",
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChapterList
            onEdit={onEdit}
            onReorder={onReorder}
            chapters={initialData.chapters || []}
          />
        </div>
      )}
      {!creating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
