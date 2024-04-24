import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from '../../../../../lib/prismadb'
export const POST = async(req:Request , {params}:{params:{courseId:string}})=>{
    try {
        const body = await req.json()

        const {userId} = auth()

        if(!userId) {
            return NextResponse.json({
                error: "You must be signed in to create a post",
                status: 401
            })
        }
        
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if(!courseOwner) {
            return NextResponse.json({
                error: "You must be signed in to create a post",
                status: 401
            })
        }
        
        const lastChapter = await prisma.chapter.findFirst({
            where: {
                courseId:params.courseId,
            },
            orderBy:{
                position:"desc"
            }
        })
        const newPosition = lastChapter ? lastChapter.position+1 : 1;
        
        const newChapter = await prisma.chapter.create({
            data:{
                courseId:params.courseId,
                position:newPosition,
               ...body
            }
        })
        
        return NextResponse.json(newChapter)
    } catch (error) {
        console.log("[COURSE_ATTACHMENT] : " , error);
        return new NextResponse("INTERAL ERROR", {
            status: 500,
        });
    }
}