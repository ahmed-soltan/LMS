import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "../../../../../../../../lib/prismadb";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon";
import ChapterTitleForm from "./components/ChapterTitleForm";
import ChapterDescriptionForm from "./components/ChapterDescriptionForm";
import ChapterAccessForm from "./components/ChapterAccessForm";
import ChapterVideoForm from "./components/ChapterVideoForm";
import Banner from "@/components/banner";
import ChapterAction from "./components/ChapterAction";
const Chapter = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });
  if (!chapter) {
    return redirect(`/teacher/courses/${params.courseId}`);
  }

  const requiredField = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredField.length;
  const completedFields = requiredField.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredField.every(Boolean)
  return (
    <>
    {!chapter.isPublished && (
      <Banner
        variant={"warning"}
        label="This Chapter is unpublished. It will not be Visible in the Course"
      />
    )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="ml-2">Back to course setup</span>
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Compelete All Fields {completionText}
                </span>
              </div>
              <ChapterAction
                disabled={!isComplete}
                chapterId={params.chapterId}
                courseId={params.courseId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize Your Chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a Video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chapter;
