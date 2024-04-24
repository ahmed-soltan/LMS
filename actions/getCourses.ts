import { Category, Course } from "@prisma/client";
import prisma from "../lib/prismadb";
import { GetProgress } from "./getProgress";

type GetCoursesWithProgressWithCategoryProps = Course & {
  progress: number | null;
  category: Category | null;
  chapters: { id: string }[];
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const GetCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
            contains: title,
        },
        categoryId
      },
      include:{
        Category:true,
        chapters:{
          where:{
            isPublished:true
          },
          select:{
            id:true
          }
        },
        purchase:{
            where:{
                userId
            }
        },
      },
      orderBy:{
        createdAt:"desc"
      }

    });

    const coursesWithProgress : any[] = await Promise.all(
        courses.map(async (course) => {
            if(course.purchase.length===0){
                return {
                   ...course,
                    progress:null
                }
            }
            const progressPercentage = await GetProgress(userId , course.id)
            return {
               ...course,
                progress:progressPercentage
            }
        })
    )

    return coursesWithProgress
  

  } catch (error) {
    console.log("[USER_PROGESS]", error);
  }
};
