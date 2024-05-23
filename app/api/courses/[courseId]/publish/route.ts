import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";



export const PATCH = async (
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
      },
      include:{
        chapters:true
      }
    });

    const hasPublishedChapters = course?.chapters?.some((chapter)=>chapter.isPublished)
    

    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.imageUrl||
      !course.categoryId||
      !hasPublishedChapters||
      !course.price
    ) {
      return NextResponse.json({
        error: "Missing required Fields",
        status: 400,
      });
    }

    const coursePusblishing = await prisma.course.update({
      where: {
        id: params.courseId,
        userId: userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(coursePusblishing);
  } catch (error) {
    console.log("[course] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};
