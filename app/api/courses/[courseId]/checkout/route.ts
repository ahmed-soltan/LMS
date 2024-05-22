import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from '../../../../../lib/prismadb'
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
export const POST = async (req: Request, {params}:{params:{courseId:string}})=>{
    try {
        const user = await currentUser();
        if(!user || !user.id || !user.emailAddresses?.[0].emailAddress){
            return NextResponse.json({
                error: "You must be signed in to create a post",
                status: 401
            })
        }

        const course = await prisma?.course.findUnique({
            where: {
                id: params.courseId,
                isPublished:true
            }
        })
        const purchase = await prisma?.purchase.findUnique({
            where: {
                userId_courseId:{
                    userId:user.id,
                    courseId:params.courseId
                }
            }
        })

        if(purchase){
            return NextResponse.json({
                error: "Already Purchased",
                status: 400
            })
        }
        
        if(!course){
            return NextResponse.json({
                error: "Course Not Found",
                status: 404
            })
        }

        const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]=[{
            price_data:{
                currency:"usd",
                product_data:{
                    name:course.title,
                    description:course.description!
                },
                unit_amount:Math.round(course.price! * 100) 
            },
            quantity:1
        }]

        let stripeCustomer = await prisma.stripeCustomer.findUnique({
            where:{
                userId:user.id
            },
            select:{
                stripeCustomerId:true
            }
        })
        
        if(!stripeCustomer){
            const customer = await stripe.customers.create({
                email:user.emailAddresses[0].emailAddress
            })
         stripeCustomer = await prisma.stripeCustomer.create({
                data:{
                    userId:user.id,
                    stripeCustomerId:customer.id
                }
            })
            
        }

        const session = await stripe.checkout.sessions.create({
            customer:stripeCustomer?.stripeCustomerId,
            line_items,
            mode:"payment",
            success_url:`${process.env.NEXT_PUBLIC_URL}/courses/${params.courseId}`,
            cancel_url:`${process.env.NEXT_PUBLIC_URL}/courses/${params.courseId}`,
            metadata:{
                courseId:params.courseId,
                userId:user.id
            }
        })

        return NextResponse.json({url:session.url})
    } catch (error) {

    }
}