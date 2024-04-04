import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import IconBadge from "@/components/shared/IconBadge";
import { File, IndianRupee, LayoutDashboard, ListChecks } from "lucide-react";
import TitleForm from "@/components/forms/TitleForm";
import DescriptionForm from "@/components/forms/DescriptionForm";
import ImageForm from "@/components/forms/ImageForm";
import CategoryForm from "@/components/forms/CategoryForm";
import PriceForm from "@/components/forms/PriceForm";
import AttachmentForm from "@/components/forms/AttachmentForm";

const CoursePage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your Course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category: any) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <div>TODO: Chapters</div>
          </div>
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={IndianRupee} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
