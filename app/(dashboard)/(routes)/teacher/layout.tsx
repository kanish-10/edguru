import React from "react";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!isAdmin(userId)) {
    return redirect("/");
  }
  return <>{children}</>;
};

export default TeacherLayout;
