import { BarChart, Compass, Layout, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  name: string | "Layout" | "Compass" | "List" | "BarChart";
  isActive: boolean;
}

const Icon = ({ name, isActive }: IconProps) => {
  return (
    <>
      {name === "Layout" && (
        <Layout
          size={22}
          className={cn("text-slate-500", isActive && "text-gray-800")}
        />
      )}
      {name === "Compass" && (
        <Compass
          size={22}
          className={cn("text-slate-500", isActive && "text-gray-800")}
        />
      )}
      {name === "BarChart" && (
        <BarChart
          size={22}
          className={cn("text-slate-500", isActive && "text-gray-800")}
        />
      )}
      {name === "List" && (
        <List
          size={22}
          className={cn("text-slate-500", isActive && "text-gray-800")}
        />
      )}
    </>
  );
};

export default Icon;
