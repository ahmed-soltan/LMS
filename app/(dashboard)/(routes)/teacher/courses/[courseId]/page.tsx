import { auth } from "@clerk/nextjs";
import prisma from "../../../../../../lib/prismadb";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import TitleForm from "./components/TitleForm";
import DescriptionForm from "./components/DescriptionForm";
import ImageForm from "./components/ImageForm";
import CategoryForm from "./components/CategoryForm";
import PriceForm from "./components/PriceForm";
import AttachmentForm from "./components/AttachmentForm";
import ChaptersForm from "./components/ChaptersForm";
import Banner from "@/components/banner";
import CourseAction from "./components/CourseAction";
const page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachment: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredField = [
    course.title,
    course.description,
    course.categoryId,
    course.price,
    course.imageUrl,
    course.chapters.some((chapters) => chapters.isPublished),
  ];

  const totalFields = requiredField.length;
  const completedFields = requiredField.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredField.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant={"warning"}
          label="This Course is unpublished. It will not be Visible to your Students"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Compelete All Fields {completionText}
            </span>
          </div>
          <CourseAction
                disabled={!isComplete}
                courseId={params.courseId}
                isPublished={course.isPublished}
              />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize Your Course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell Your Course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
