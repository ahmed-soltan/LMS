import prisma from "../lib/prismadb";

export const GetProgress = async (
  userId: string,
  courseId: string
) => {
  try {
    const publishedChapter = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterId = publishedChapter.map((chapter) => chapter.id);
    const validCompletedChapter = await prisma.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterId,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapter / publishedChapterId.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[USER_PROGESS]",error);
  }
};
