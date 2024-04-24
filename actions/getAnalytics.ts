import { Course, Purchase } from "@prisma/client"
import prisma from '../lib/prismadb'

type GroupByCourseProps = Purchase & {
    course:Course
}

export const groupByCourse = async(purchase:any[])=>{
    const grouped : {[courseTitle: string]:number} = {}
    purchase.forEach((purchase) =>{
        const courseTitle = purchase.course.title
        if(!grouped[courseTitle]){
            grouped[courseTitle] = 0
        }
        grouped[courseTitle] += purchase.course.price!
    })
    return grouped
}
export const getAnalytics = async(userId:string)=>{
   try {
        const purchases = await prisma.purchase.findMany({
            where:{
                course:{
                    userId:userId
                },
            },
            include:{
                course:true
            }
        })


        const groupEarning = await groupByCourse(purchases)
        console.log(groupEarning)
        const data = Object.entries(groupEarning).map(([courseTitle , total])=>({
            name:courseTitle,
            total:total
        }))

        const totalRevenue = data.reduce((acc , curr)=>acc+curr.total,0)
        const totalSales = purchases.length

        return {
            data,
            totalRevenue,
            totalSales
        }

   } catch (error) {
        console.log("GET_ANALYTICS : " , error)
        return {
            data:[],
            totalRevenue:0,
            totalSales:0,
        }
   }
}