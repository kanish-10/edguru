"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/database/db";

interface CreateCourseProps {
  title: string;
}

interface UpdateCourseProps {
  courseId: string;
  value: any;
}

export const createCourse = async ({ title }: CreateCourseProps) => {
  try {
    const { userId } = auth();
    if (!userId) {
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
    if (!userId) {
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
