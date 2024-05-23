import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prismadb";



// DELETE Handler
export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "You must be signed in to delete a chapter", status: 401 });
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return NextResponse.json({ error: "You do not have permission to delete this chapter", status: 403 });
    }

    const chapter = await prisma.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // Shift positions of the remaining chapters
    await prisma.chapter.updateMany({
      where: {
        courseId: params.courseId,
        position: {
          gt: chapter.position,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

    const isAnyChapterExist = await prisma.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!isAnyChapterExist.length) {
      await prisma.course.update({
        where: { id: params.courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(chapter);

  } catch (error) {
    console.log("[DELETE ERROR] :", error);
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
};

// PATCH Handler
export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { isPublished,...values } = body;

    if (!userId) {
      return NextResponse.json({ error: "You must be signed in to update a chapter", status: 401 });
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });


    if (!courseOwner) {
      return NextResponse.json({ error: "You do not have permission to update this chapter", status: 403 });
    }

    const chapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: { ...values },
    });



    return NextResponse.json(chapter);

  } catch (error) {
    console.log("[PATCH ERROR] :", error);
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
};
