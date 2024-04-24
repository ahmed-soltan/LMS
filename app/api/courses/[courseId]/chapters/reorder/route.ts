import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prismadb";

export const PUT = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const body = await req.json();

        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({
                error: "You must be signed in to reorder chapters",
                status: 401
            });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return NextResponse.json({
                error: "You are not authorized to reorder chapters for this course",
                status: 401
            });
        }

        for (let item of body.list) {
            await prisma.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position
                }
            });
        }

        return NextResponse.json({
            message: "Chapters reordered successfully",
            status: 200
        });
    } catch (error) {
        console.log("[COURSE_REORDER] : ", error);
        return new NextResponse("INTERNAL ERROR", {
            status: 500,
        });
    }
};
