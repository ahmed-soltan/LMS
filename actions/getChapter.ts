import { Attachment, Chapter, MuxData } from "@prisma/client";
import prisma from "../lib/prismadb";
interface getChapterProps {
  courseId: string;
  chapterId: string;
  userId: string;
}

export const getChapter = async ({
  courseId,
  chapterId,
  userId,
}: getChapterProps) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });


    if (!course || !chapter) {
      throw new Error("Course or Chapter not found");
    }

    let attachments: Attachment[] = [];
    let muxData = null;
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await prisma.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    if (purchase || chapter.isFree) {
      muxData = await prisma.muxData.findUnique({
        where: {
          chapterId: chapter.id,
        },
      });
    }

    nextChapter = await prisma.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: chapter.id,
        },
      },
    });

    return {
        course,
        chapter,
        attachments,
        muxData,
        nextChapter,
        userProgress,
        purchase
    }

  } catch (error) {
      console.log("Error fetching chapter:", error); // Log the error for debugging purposes
    return {
      chapter: null,
      course: null,
      muxData: null,
      userProgress: null,
      purchase: null,
      nextChapter: null,
      attachments: [],
    };
  }
};
