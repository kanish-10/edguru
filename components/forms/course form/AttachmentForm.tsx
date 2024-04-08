"use client";

import * as z from "zod";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "@/components/ui/use-toast";
import {
  createAttachment,
  deleteAttachment,
} from "@/action/attachments.action";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Image is required",
  }),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingAttachment, setDeletingAttachment] = useState<string | null>(
    null,
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await createAttachment({ courseId, url: value.url });
      toast({ title: "Attachment Added" });
      toggleEdit();
      router.refresh();
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingAttachment(id);
      await deleteAttachment({ courseId, attachmentId: id });
      toast({ title: "Attachment Deleted" });
      router.refresh();
    } catch (e) {
      toast({
        title: "Not Deleted. Something went wrong",
        variant: "destructive",
      });
    } finally {
      setDeletingAttachment(null);
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add an file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500 ">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                  key={attachment.name}
                >
                  <File className="mr-2 size-4 shrink-0" />
                  <p className="line-clamp-1 text-xs">{attachment.name}</p>
                  {deletingAttachment === attachment.id && (
                    <div>
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  )}
                  {deletingAttachment !== attachment.id && (
                    <Button
                      variant={null}
                      className="ml-auto transition hover:opacity-75"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="size-4 " />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your student might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
