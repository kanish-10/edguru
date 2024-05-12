"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/database/db";
import { Category, Chapter } from "@prisma/client";
import { getProgress } from "@/lib/utils";
import { isAdmin } from "@/lib/admin";

interface CreateCourseProps {
  title: string;
}

interface Course {
  courseId: string;
}

interface UpdateCourseProps {
  courseId: string;
  value: any;
}

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number;
};

type DashboardCourses = {
  completedCourses: any[];
  coursesInProgress: any[];
};

export const createCourse = async ({ title }: CreateCourseProps) => {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin(userId)) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return course;
  } catch (e) {
    console.log("[COURSES]: ", e);
  }
};

export const updateCourse = async ({ courseId, value }: UpdateCourseProps) => {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin(userId)) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        ...value,
      },
    });

    return course;
  } catch (e) {
    console.log("[COURSES]: ", e);
  }
};

export const deleteCourse = async ({ courseId }: Course) => {
  try {
    const { userId } = auth();

    if (!userId || !isAdmin(userId)) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return deletedCourse;
  } catch (e) {
    console.log("[COURSES]: ", e);
  }
};

export const publishCourse = async ({ courseId }: Course) => {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin(userId)) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter: any) => chapter.isPublished,
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapter ||
      !course.categoryId ||
      !course.price
    ) {
      throw new Error("Course is incomplete");
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: {
        isPublished: true,
      },
    });

    return publishedCourse;
  } catch (e) {
    console.log("[COURSES]: ", e);
  }
};

export const unpublishCourse = async ({ courseId }: Course) => {
  try {
    const { userId } = auth();
    if (!userId || !isAdmin(userId)) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: {
        isPublished: false,
      },
    });

    return unpublishedCourse;
  } catch (e) {
    console.log("[COURSES]: ", e);
  }
};

export const getDashboardCourses = async (
  userId: string,
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase: any) => purchase.course as CourseWithProgressWithCategory[],
    );

    for (const course of courses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress;
    }

    const completedCourses = courses.filter(
      (course: any) => course.progress === 100,
    );

    const coursesInProgress = courses.filter(
      (course: any) => (course.progress ?? 0) < 100,
    );

    return { completedCourses, coursesInProgress };
  } catch (e: any) {
    console.log("[DASHBOARD_COURSES_ERROR]: ", e.message);
    return { completedCourses: [], coursesInProgress: [] };
  }
};
