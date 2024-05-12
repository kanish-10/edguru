import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/lib/utils";
import DataCard from "@/components/shared/DataCard";
import Chart from "@/components/shared/Chart";

const TeacherAnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/login");
  }

  const { totalRevenue, totalSales, data } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard label="Total Sales" value={totalSales} />
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default TeacherAnalyticsPage;
