import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "@/components/shared/CourseMobileSidebar";
import NavbarRoutes from "@/components/bars/navbar/NavbarRoutes";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[];
    })[];
  };
  progressCount?: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm dark:bg-slate-950">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
