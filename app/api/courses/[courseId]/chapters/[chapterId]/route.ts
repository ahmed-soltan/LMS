import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prismadb";

import Mux from '@mux/mux-node';
const {video} = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export const DELETE = async (
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

    const chapter=await prisma.chapter.delete({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if (chapter.videoUrl) {
      const videoExist = await prisma.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (videoExist) {
       await video.assets.delete(videoExist.assetId);
       await prisma.muxData.delete({
         where: {
           id: videoExist.id,
         },
       });
      }

    }

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
    console.log("[ATTACMENT_ID] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};


export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const body = await req.json();

    const { userId } = auth();
    const { isPublished, ...values } = body;

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
        ...values,
      },
    });

    if (values.videoUrl) {
      const videoExist = await prisma.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (videoExist) {
       await video.assets.delete(videoExist.assetId);
       await prisma.muxData.delete({
         where: {
           id: videoExist.id,
         },
       });
      }

      const assets = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test:false
      })

      await prisma.muxData.create({
        data:{
          assetId:assets.id,
          chapterId:params.chapterId,
          playbackId:assets.playback_ids?.[0].id
        }
      })

    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[chapter] : ", error);
    return new NextResponse("INTERAL ERROR", {
      status: 500,
    });
  }
};
