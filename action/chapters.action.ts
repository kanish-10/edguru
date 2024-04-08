"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/database/db";

interface CreateChapterProps {
  title: string;
  courseId: string;
}

interface ChapterReorderProps {
  updateData: {
    id: string;
    position: number;
  }[];
  courseId: string;
}

interface UpdateChapterProps {
  courseId: string;
  chapterId: string;
  value: any;
}

export const createChapter = async ({
  title,
  courseId,
}: CreateChapterProps) => {
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

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });

    return chapter;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e.message);
  }
};

export const chapterReorder = async ({
  updateData,
  courseId,
}: ChapterReorderProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) throw new Error("Unauthorized");
    for (const item of updateData) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: { position: item.position },
      });
    }
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e.message);
  }
};

export const updateChapter = async ({
  courseId,
  chapterId,
  value,
}: UpdateChapterProps) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    // const { isPublished } = value;
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) throw new Error("Unauthorized");

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...value,
      },
    });
    return chapter;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e);
  }
};
