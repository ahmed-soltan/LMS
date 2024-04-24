import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

import Mux from "@mux/mux-node";
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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
        chapters:{
          include:{
            muxData:true
          }
        }
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
