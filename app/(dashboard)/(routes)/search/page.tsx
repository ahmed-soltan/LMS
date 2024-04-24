import SearchInput from "@/components/SearchInput";
import prisma from "../../../../lib/prismadb";
import Categories from "./_components/categories";
import { GetCourses } from "@/actions/getCourses";
import { auth } from "@clerk/nextjs";
import CoursesList from "./_components/CoursesList";

interface SearchProps{
  searchParams:{
    title:string,
    categoryId:string
  }
}

const page = async ({searchParams}:SearchProps) => {
  const {userId} = auth()
  if(!userId){
    return null
  }
  const categories = await prisma?.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const courses = await GetCourses({userId , ...searchParams})

  return (
    <>
      <div className="px-6 pt-6 md:hidden block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default page;
