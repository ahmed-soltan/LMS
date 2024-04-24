import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from '../../../lib/prismadb'
export const POST = async(req:Request)=>{
    try {
        const body = await req.json()

        const {userId} = auth()
        const {title} = body

        if(!userId) {
            return NextResponse.json({
                error: "You must be signed in to create a post",
                status: 401
            })
        }

        const course = await prisma.course.create({
            data: {
                title,
                userId: userId
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES] : " , error);
        return new NextResponse("INTERAL ERROR", {
            status: 500,
        });
    }
}