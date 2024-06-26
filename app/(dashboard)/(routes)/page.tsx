import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/action/courses.action";
import CoursesList from "@/components/shared/CoursesList";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";

const Home = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/login");
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default Home;
