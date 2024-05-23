import { getChapter } from "@/actions/getChapter";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import { File } from "lucide-react";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseProgressButton from "./_components/CourseProgressButton";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const {
    course,
    chapter,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    courseId: params.courseId,
    chapterId: params.chapterId,
    userId: userId,
  });

  if (!course || !chapter) {
    return redirect("/");
  }


  const isBlocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You Already Completed This Chapter." />
      )}
      {isBlocked && (
        <Banner
          variant="warning"
          label="You Need to purchase this course to Watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            courseId={params.courseId}
            title={chapter.title}
            video={chapter.videoUrl!}
            nextChapterId={nextChapter?.id}
            isBlocked={isBlocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <div className="flex items-center gap-x-2">
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              </div>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                coursePrice={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length ? (
            <>
              <Separator />
              <div className="p-4 flex flex-col gap-2">
                {attachments.map((attach) => {
                  return (
                    <a
                      href={attach.url}
                      target="_blank"
                      key={attach.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline "
                    >
                      <File className="w-6 h-6 mr-2"/>
                      <p className="line-clamp-1">{attach.name}</p>
                    </a>
                  );
                })}
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
