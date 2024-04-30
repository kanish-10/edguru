import React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/data-table/Columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/database/db";

const TeacherCoursesPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default TeacherCoursesPage;
