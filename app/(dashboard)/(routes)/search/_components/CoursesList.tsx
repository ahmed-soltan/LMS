"use client";

import { Category, Course } from "@prisma/client";
import CourseCard from "./CourseCard";

export type CoursesWithProgressWithCategoryProps = Course & {
  progress: number | null;
  Category: Category | null;
  chapters: { id: string }[];
};
interface CoursesListProps {
  items: CoursesWithProgressWithCategoryProps[] | undefined;
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items &&
          items.map((item) => (
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.imageUrl!}
              progress={item.progress}
              category={item?.Category?.name!}
              chapterLength={item.chapters.length}
              price={item.price!}
            />
          ))}
      </div>
      {items && items.length === 0 && (
        <div className="flex items-center justify-center text-center mt-8 rounded-md">
          <p className="text-sm mt-2 text-slate-500 italic">No Courses Found</p>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
