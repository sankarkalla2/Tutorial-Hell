import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_componets/data-table";
import { columns } from "./_componets/column";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const Courses = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default Courses;
