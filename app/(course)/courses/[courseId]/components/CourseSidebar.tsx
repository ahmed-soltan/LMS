import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "../../../../../lib/prismadb";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/CourseProgress";
export interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  currentProgress: number;
}

const CourseSidebar = async ({
  course,
  currentProgress,
}: CourseSidebarProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const purchase = await prisma?.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full flex flex-col border-r overflow-y-auto shadow-sm w-full">
      <div className="p-6 flex flex-col border-b w-full">
        <h1 className="font-semibold w-full">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            
          <CourseProgress
            variant={"success"}
            value={currentProgress}
            />
            </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) =>{
            return (
                <CourseSidebarItem 
                    key={chapter.id}
                    id={chapter.id}
                    label={chapter.title}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    isLocked={!chapter.isFree && !purchase}
                    courseId={course.id}
                />
            )
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;
