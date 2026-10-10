"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getStudentById } from "@/services/student.service";

export default function DashboardPage() {
  const { user, accessToken } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-dashboard", user?.id],
    queryFn: () => getStudentById(user!.id, accessToken!),
    enabled: !!user && !!accessToken,
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <p className="text-muted-foreground">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">
          Unable to load dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Please try again later.
        </p>
      </main>
    );
  }

  const student = data.data;

  const quickLinks = [
    {
      title: "My Profile",
      description: "View your personal and academic information.",
      href: "/dashboard/profile",
    },
    {
      title: "Courses",
      description: "View your enrolled courses.",
      href: "/dashboard/courses",
    },
    {
      title: "Attendance",
      description: "Check your attendance records.",
      href: "/dashboard/attendance",
    },
    {
      title: "Results",
      description: "View your examination results and GPA.",
      href: "/dashboard/results",
    },
    {
      title: "Transcript",
      description: "View your academic transcript.",
      href: "/dashboard/transcript",
    },
    {
      title: "Payments",
      description: "Manage your university payments.",
      href: "/dashboard/payments",
    },
  ];

  return (
    <main className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {student.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Here is an overview of your university account.
        </p>
      </div>

      {/* Student Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Student ID
          </p>

          <p className="mt-2 text-xl font-semibold">
            {student.studentId}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Program
          </p>

          <p className="mt-2 font-semibold">
            {student.program.code}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Duration
          </p>

          <p className="mt-2 text-xl font-semibold">
            {student.program.duration} Years
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Department
          </p>

          <p className="mt-2 font-semibold">
            Department #{student.program.departmentId}
          </p>
        </div>
      </section>

      {/* Program */}
      <section className="mt-8 rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Current Program
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          {student.program.name}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Program Code: {student.program.code}
        </p>
      </section>

      {/* Quick Links */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          Quick Access
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border p-5 transition hover:bg-muted"
            >
              <h3 className="font-semibold">
                {link.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}