"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { checkout } from "@/action/stripe.action";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await checkout(courseId);
      console.log(response);
      // @ts-ignore
      window.location.assign(response?.url);
    } catch (e) {
      toast({ variant: "destructive", title: "Something went wrong" });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      size="sm"
      onClick={onClick}
      disabled={loading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
