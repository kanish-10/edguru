"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log(res);
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast({
          title: `${error?.message}`,
          variant: "destructive",
        });
      }}
    />
  );
};

export default FileUpload;
