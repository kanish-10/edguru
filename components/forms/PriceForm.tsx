"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/action/courses.action";
import { cn, formatPrice } from "@/lib/utils";

const formSchema = z.object({
  price: z.coerce.number(),
});

interface PriceFormProps {
  initialData: {
    price: number;
  };
  courseId: string;
}

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await updateCourse({ courseId, value });
      toast({ title: "Course title updated" });
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Price
        <Button variant="ghost" onClick={toggleEdit}>
          {editing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!editing ? (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.price && "text-slate-500 italic",
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
