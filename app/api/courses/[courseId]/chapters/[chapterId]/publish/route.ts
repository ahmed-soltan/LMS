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
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });


    if (
      !chapter ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return NextResponse.json({
        error: "Missing required Fields",
        status: 400,
      });
    }

    const chapterPusblishing = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(chapterPusblishing);
  } catch (error) {
    console.log("[chapter] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};
