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
        
        const attachment = await prisma.attachment.create({
            data: {
                courseId:params.courseId,
                name:body.url.split('/').pop(),
                ...body
            }
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.log("[COURSE_ATTACHMENT] : " , error);
        return new NextResponse("INTERAL ERROR", {
            status: 500,
        });
    }
}