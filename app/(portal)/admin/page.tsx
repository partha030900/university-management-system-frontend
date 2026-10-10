"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllCourses } from "@/services/course.service";
import { useAuthStore } from "@/store/auth-store";
import { getAllStudentsCount } from "@/services/student.service";
import { getInstructorCount } from "@/services/instructor.service";

export default function AdminPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });
  const {
  data: studentCount,
  isLoading: isStudentsLoading,
  isError: isStudentsError,
} = useQuery({
  queryKey: ["admin", "student-count"],
  queryFn: () => getAllStudentsCount(accessToken!),
  enabled: !!accessToken,
});

const {
  data: instructorCount,
  isLoading: isInstructorsLoading,
  isError: isInstructorsError,
} = useQuery({
  queryKey: ["admin", "instructor-count"],
  queryFn: () => getInstructorCount(accessToken!),
  enabled: !!accessToken,
});

  const cards = [
    {
      title: "Total Courses",
      value: isLoading
        ? "..."
        : isError
          ? "Error"
          : courses?.length ?? 0,
      href: "/admin/courses",
      description: "View and manage courses",
    },
    {
  title: "Students",
  value: isStudentsLoading
    ? "..."
    : isStudentsError
      ? "Error"
      : studentCount ?? 0,
  href: "/admin/students",
  description: "View student records",
},
    {
      title: "Reports",
      value: "—",
      href: "/admin/reports",
      description: "View system reports",
    },

    {
  title: "Instructors",
  value: isInstructorsLoading
    ? "..."
    : isInstructorsError
      ? "Error"
      : instructorCount ?? 0,
  href: "/admin",
  description: "Total registered instructors",
},
  ];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the Admin Dashboard. Manage your university from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-sm font-medium text-muted-foreground">
              {card.title}
            </h2>

            <p className="mt-3 text-3xl font-bold">{card.value}</p>

            <p className="mt-2 text-sm text-muted-foreground">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {isStudentsError && (
  <p className="text-sm text-destructive">
    Could not load student count. Please try again later.
  </p>
)}
{isInstructorsError && (
  <p className="text-sm text-destructive">
    Could not load instructor count. Please try again later.
  </p>
)}
    </main>
  );
}