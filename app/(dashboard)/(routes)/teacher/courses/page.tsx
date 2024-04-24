import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "../../../../../lib/prismadb";

const page = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await prisma.course.findMany({
    where: {
      userId: userId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={course} />
    </div>
  );
};

export default page;
