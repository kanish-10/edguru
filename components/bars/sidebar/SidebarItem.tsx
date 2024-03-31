"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@/components/shared/Icon";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: string;
}

const SidebarItem = ({ label, icon, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-gray-700 bg-gray-200/20 hover:bg-gray-200/20 hover:text-gray-700",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon name={icon} isActive={isActive} />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-gray-700 h-full transition-all",
          isActive && "opacity-100",
        )}
      />
    </button>
  );
};

export default SidebarItem;
