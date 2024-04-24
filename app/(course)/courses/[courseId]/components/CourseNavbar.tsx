import { CourseSidebarProps } from "./CourseSidebar";
import MobileSidebar from "@/app/(dashboard)/_components/MobileSidebar";
import NavbarRoutes from "@/components/navbar-routes";
import CourseMobileSidebar from "./CourseMobileSidebar";

const CourseNavbar = ({ course, currentProgress }: CourseSidebarProps) => {
  return (
    <div className="p-6 flex items-center bg-white shadow-sm border-b h-full">
      <CourseMobileSidebar
        course={course}
        currentProgress={currentProgress}
      />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
