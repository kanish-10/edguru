"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );
  return (
    <div className="bg-white">
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly
        className="bg-[#F1F5F9]"
      />
    </div>
  );
};

export default Preview;
