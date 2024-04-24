import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prismadb";
export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) => {
  try {

    const { userId } = auth();


    if (!userId) {
      return NextResponse.json({
        error: "You must be signed in to create a post",
        status: 401,
      });
    }
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json({
        error: "You must be signed in to create a post",
        status: 401,
      });
    }

    const attachment=await prisma.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);

  } catch (error) {
    console.log("[ATTACMENT_ID] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};
