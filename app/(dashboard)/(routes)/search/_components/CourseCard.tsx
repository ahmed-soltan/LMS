"use client";

import CourseProgress from "@/components/CourseProgress";
import { IconBadge } from "@/components/icon";
import { formatPrice } from "@/lib/formatPrice";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CoursesListProps {
  id: string;
  title: string;
  image: string;
  price: number;
  progress: number | null;
  category: string;
  chapterLength: number;
}

const CourseCard = ({
  id,
  title,
  image,
  price,
  progress,
  category,
  chapterLength,
}: CoursesListProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden rounded-lg border p-3 h-full cursor-pointer">
        <div className="relative aspect-video w-full rounded-md overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-1">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 text-center flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center  gap-x-2 text-slate-500">
              <IconBadge icon={BookOpen} size={"sm"} />
              <span>
                {chapterLength} {chapterLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              size="sm"
              variant={progress === 100 ? "success" : "default"}
              value={progress}
            />
          ) : (
            <p className="text-md md:text-sm text-slate-700 font-medium">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
