"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/database/db";
import { isAdmin } from "@/lib/admin";

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

interface ChapterProps {
  courseId: string;
  chapterId: string;
}

export const createChapter = async ({
  title,
  courseId,
}: CreateChapterProps) => {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");
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
    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");
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
    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");
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

export const deleteChapter = async ({ chapterId, courseId }: ChapterProps) => {
  try {
    const { userId } = auth();

    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) throw new Error("Chapter not found");

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChapter = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChapter.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return deletedChapter;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e);
  }
};

export const publishChapter = async ({ courseId, chapterId }: ChapterProps) => {
  try {
    const { userId } = auth();

    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl)
      throw new Error("Missing required fields");

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return publishedChapter;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e);
  }
};

export const unpublishChapter = async ({
  courseId,
  chapterId,
}: ChapterProps) => {
  try {
    const { userId } = auth();

    if (!userId || !isAdmin(userId)) throw new Error("Unauthorized");

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return publishedChapter;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e);
  }
};

export const getChapter = async (
  userId: string,
  courseId: string,
  chapterId: string,
) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: { isPublished: true, id: courseId },
      select: { price: true },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) throw new Error("Chapter or course not found");

    let attachments = [];
    let nextChapter = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    return {
      chapter: null,
      course: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};

export const updateProgress = async ({
  courseId,
  chapterId,
  isCompleted,
}: {
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return userProgress;
  } catch (e: any) {
    console.log("[CHAPTER]: ", e);
    throw new Error(e);
  }
};
