"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/database/db";

interface CreateAttachmentProps {
  url: string;
  courseId: string;
}

interface DeleteAttachmentProps {
  attachmentId: string;
  courseId: string;
}

export const createAttachment = async ({
  url,
  courseId,
}: CreateAttachmentProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) throw new Error("Unauthorized");
    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId,
      },
    });
    return attachment;
  } catch (e: any) {
    console.log("[ATTACHMENT]: ", e);
    throw new Error(e.message);
  }
};

export const deleteAttachment = async ({
  courseId,
  attachmentId,
}: DeleteAttachmentProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) throw new Error("Unauthorized");
    const attachment = await db.attachment.delete({
      where: {
        courseId,
        id: attachmentId,
      },
    });

    return attachment;
  } catch (e: any) {
    console.log("[ATTACHMENT]: ", e);
    throw new Error(e.message);
  }
};
