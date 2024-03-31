import React from "react";
import MobileSidebar from "@/components/bars/sidebar/MobileSidebar";
import NavbarRoutes from "@/components/bars/navbar/NavbarRoutes";

const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
