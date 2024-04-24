"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => {
      return {
        id: chapter.id,
        position:items.findIndex(item=>item.id === chapter.id),
      };
    });

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => {
              return (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        chapter.isPublished &&
                          "bg-sky-100 text-sky-700 border-sky-200"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-md transition w-full flex items-center justify-between",
                          chapter.isPublished &&
                            "hover:bg-sky-200 border-r-sky-200"
                        )}
                        {...provided.dragHandleProps}
                      >
                        <div className=" flex items-center gap-2">
                          <Grip className="h-5 w-5" />
                          {chapter.title}
                        </div>
                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                          {chapter.isFree && <Badge>Free</Badge>}
                          <Badge
                            className={cn(
                              !chapter.isPublished && "bg-slate-500",
                              chapter.isPublished && "bg-sky-700"
                            )}
                          >
                            {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Pencil
                            className={
                              "w-4 h-4 cursor-pointer hover:opacity-75"
                            }
                            onClick={() => onEdit(chapter.id)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
