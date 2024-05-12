"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/shared/SearchInput";
import { isAdmin } from "@/lib/admin";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursesPage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";
  const { userId } = useAuth();
  const admin = isAdmin(userId);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isCoursesPage ? (
          <Link href="/">
            <Button variant="ghost" className="" size="sm">
              <LogOut className="mr-2 size-4" />
              Exit
            </Button>
          </Link>
        ) : admin ? (
          <Link href="/teacher/courses">
            <Button variant="ghost" className="" size="sm">
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
