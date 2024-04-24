import { Category, Chapter, Course } from "@prisma/client";
import prisma from "../lib/prismadb";
import { GetProgress } from "./getProgress";

type CoursesWithProgressWithCategoryProps = Course & {
  progress: number | null;
  Category: Category | null;
  chapters: Chapter[];
};

type DashboardCourses = {
  completedCourses:CoursesWithProgressWithCategoryProps[]
  coursesInProgress:CoursesWithProgressWithCategoryProps[]
};

export const getDashboardCourses = async (userId: string) => {
  try {
    const purchasedCourses = await prisma.purchase.findMany({
        where: {
          userId: userId,
        },
        select: {
            course:{
                include:{
                    Category:true,
                    chapters:{
                        where:{
                            isPublished:true
                        },
                    }
                }
            }
        },
    })

    const courses = purchasedCourses.map((purchase)=>purchase.course) as CoursesWithProgressWithCategoryProps[]
    for(let course of courses){
        const progress = await GetProgress(userId, course.id)
        course["progress"] = progress || 0
    }
    

    const completedCourses = courses.filter((course)=>course.progress===100)
    const coursesInProgress = courses.filter((course)=>(course.progress ?? 0)!==100)
    return {
        completedCourses,
        coursesInProgress
    }
  } catch (error) {
    console.log("[DASHBOARD_COURSES]", error);
    return {
        completedCourses:[],
        coursesInProgress:[]
    }
  }
};
