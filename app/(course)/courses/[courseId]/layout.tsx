import { auth } from "@clerk/nextjs";
import prisma from "../../../../lib/prismadb";
import { redirect } from "next/navigation";
import { GetProgress } from "@/actions/getProgress";
import CourseSidebar from "./components/CourseSidebar";
import Navbar from "@/app/(dashboard)/_components/Navbar";
import CourseNavbar from "./components/CourseNavbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");
  const currentProgress = await GetProgress(userId, course.id);
  return (
    <div className="h-full">
      <div className="md:pl-72 h-[80px] w-full inset-x-0 fixed z-50">
        <CourseNavbar course={course} currentProgress={currentProgress!}/>
      </div>
      <div className="hidden md:flex flex-col w-72 h-full inset-y-0 fixed z-50">
        <CourseSidebar
            course={course}
            currentProgress={currentProgress!}
        />
      </div>
      <main className="md:pl-72 pt-[80px] h-full ">{children}</main>
    </div>
  );
};

export default CourseLayout;
