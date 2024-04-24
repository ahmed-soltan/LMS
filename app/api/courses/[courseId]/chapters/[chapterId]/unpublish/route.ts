import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prismadb";

export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) => {
    try {
  
      const { userId } = auth();
  
      if (!userId) {
        return NextResponse.json({
          error: "You must be signed in to create a post",
          status: 401,
        });
      }
  
      const chapter = await prisma.chapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          isPublished:false,
        },
      });

      const isAnyChapterExist = await prisma.chapter.findMany({
        where: {
          courseId: params.courseId,
          isPublished:true
        },
      })
  
      if(!isAnyChapterExist.length){
        await prisma.course.update({
          where: {
            id: params.courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }
  

        
      return NextResponse.json(chapter);
    } catch (error) {
      console.log("[chapter] : ", error);
      return new NextResponse("INTERAL ERROR", {
        status: 500,
      });
    }
  };