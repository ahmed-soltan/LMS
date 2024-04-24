import { getDashboardCourses } from "@/actions/getDashboardCourses";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "../search/_components/CoursesList";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/InfoCard";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const { coursesInProgress, completedCourses } = await getDashboardCourses(
    userId
  );
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Courses In Progress"
          count={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed Courses "
          count={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
