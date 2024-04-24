import { redirect } from 'next/navigation'
import prisma from '../../../../lib/prismadb'
const CourseIdPage = async({params}:{params:{courseId:string}}) => {
  const course = await prisma.course.findUnique({
    where:{
      id:params.courseId
    },
    include:{
      chapters:{
        orderBy:{
          position:'asc'
        }
      },
      attachment:{
        orderBy:{
          createdAt:'desc'
        }
      }
    }
  })

  if(!course){
    return redirect('/')
  }
  
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);

}

export default CourseIdPage
