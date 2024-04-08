"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterListProps {
  chapters: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChapterList = ({ chapters, onEdit, onReorder }: ChapterListProps) => {
  const [mounted, setMounted] = useState(false);
  const [chapter, setChapter] = useState(chapters);

  useEffect(() => {
    setChapter(chapters);
  }, [chapters]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapter);
    const [removedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removedItem);

    setChapter(items);

    const updatedChapters = items.map((c) => ({
      id: c.id,
      position: items.findIndex((item) => item.id === c.id),
    }));

    onReorder(updatedChapters);
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapter.map((chap, index) => (
              <Draggable key={chap.id} draggableId={chap.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      chap.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700",
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chap.isPublished && "border-r-sky-200 hover:bg-sky-200",
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="size-5" />
                    </div>
                    {chap.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chap.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chap.isPublished && "bg-sky-700",
                        )}
                      >
                        {chap.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        className="size-4 cursor-pointer transition hover:opacity-75"
                        onClick={() => onEdit(chap.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
