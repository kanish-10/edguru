import { LucideIcon } from "lucide-react";
import IconBadge from "@/components/shared/IconBadge";

interface InfoCardProps {
  icon: LucideIcon;
  numberOfItems: number;
  label: string;
  variant?: "default" | "success";
}

const InfoCard = ({
  icon: Icon,
  variant,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
