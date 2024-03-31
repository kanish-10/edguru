import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <Image src="/logo.svg" alt="logo" width={70} height={70} />
      <p className="text-2xl font-bold">EdGuru</p>
    </div>
  );
};

export default Logo;
