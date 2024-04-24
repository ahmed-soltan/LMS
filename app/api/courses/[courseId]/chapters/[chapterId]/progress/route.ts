import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prismadb";

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {

    const { userId } = auth();
    const {isCompleted} = await req.json()
    if (!userId) {
      return NextResponse.json({
        error: "You must be signed in to create a post",
        status: 401,
      });
    }

    const userProgress = await prisma.userProgress.upsert({
        where:{
            userId_chapterId:{
                userId:userId,
                chapterId:params.chapterId
            }
        },
        update:{
            isCompleted:isCompleted
        },
        create:{
            userId:userId,
            chapterId:params.chapterId,
            isCompleted:isCompleted
        }
    })

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[chapter] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};
