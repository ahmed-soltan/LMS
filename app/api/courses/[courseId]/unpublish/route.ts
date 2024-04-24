import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string;} }
  ) => {
    try {
  
      const { userId } = auth();
  
      if (!userId) {
        return NextResponse.json({
          error: "You must be signed in to create a post",
          status: 401,
        });
      }
  
      const course = await prisma.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished:false,
        },
      });

  
      

        
      return NextResponse.json(course);
    } catch (error) {
      console.log("[COURSE] : ", error);
      return new NextResponse("INTERAL ERROR", {
        status: 500,
      });
    }
  };