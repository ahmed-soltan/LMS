import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from '../../../../lib/prismadb'


export const DELETE = async (
    req: Request,
    { params }: { params: { courseId: string; } }
  ) => {
    try {
  
      const { userId } = auth();
  
  
      if (!userId) {
        return NextResponse.json({
          error: "You must be signed in to create a post",
          status: 401,
        });
      }
      const course = await prisma.course.findUnique({
        where: {
          id: params.courseId,
          userId: userId,
        },
        include:{
            chapters:true
        }
      });
  
      if (!course) {
        return NextResponse.json({
          error: "Course not Found",
          status: 404,
        });
      }


  
     const deletedCourse = await prisma.course.delete({
        where: {
          id: params.courseId,
        },
     })
  
    
  
      return NextResponse.json(deletedCourse);
  
    } catch (error) {
      console.log("[ATTACMENT_ID] : ", error);
      return new NextResponse("INTERAL ERROR", {
        status: 500,
      });
    }
  };

export const PATCH = async(req:Request , {params}:{params:{courseId:string}})=>{
    try {
        const body = await req.json()

        const {userId} = auth()
        const {title} = body

        if(!userId) {
            return NextResponse.json({
                error: "You must be signed in to create a post",
                status: 401
            })
        }

        

        const course = await prisma.course.update({
            where:{
                id:params.courseId,
                userId: userId
            },
            data: {
                ...body
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES] : " , error);
        return new NextResponse("INTERAL ERROR", {
            status: 500,
        });
    }
}