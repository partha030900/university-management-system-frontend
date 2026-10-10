"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getAllCourses } from "@/services/course.service";
import { getAllStudentsCount } from "@/services/student.service";
import { getInstructorCount } from "@/services/instructor.service";
import { getAdminRegistrationStats } from "@/services/registration.service";

export default function AdminReportsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const studentsQuery = useQuery({
    queryKey: ["admin", "student-count"],
    queryFn: () => getAllStudentsCount(accessToken!),
    enabled: !!accessToken,
  });

  const instructorsQuery = useQuery({
    queryKey: ["admin", "instructor-count"],
    queryFn: () => getInstructorCount(accessToken!),
    enabled: !!accessToken,
  });

  const registrationStatsQuery = useQuery({
  queryKey: ["admin", "registration-stats"],
  queryFn: () => getAdminRegistrationStats(accessToken!),
  enabled: !!accessToken,
});

  const reports = [
    {
      title: "Total Courses",
      value: coursesQuery.isLoading
        ? "..."
        : coursesQuery.isError
          ? "Error"
          : coursesQuery.data?.length ?? 0,
    },
    {
      title: "Total Students",
      value: studentsQuery.isLoading
        ? "..."
        : studentsQuery.isError
          ? "Error"
          : studentsQuery.data ?? 0,
    },
    {
      title: "Total Instructors",
      value: instructorsQuery.isLoading
        ? "..."
        : instructorsQuery.isError
          ? "Error"
          : instructorsQuery.data ?? 0,
    },
{
  title: "Total Registrations",
  value: registrationStatsQuery.isLoading
    ? "..."
    : registrationStatsQuery.isError
      ? "Error"
      : registrationStatsQuery.data?.totalRegistrations ?? 0,
},
{
  title: "Paid Registrations",
  value: registrationStatsQuery.isLoading
    ? "..."
    : registrationStatsQuery.isError
      ? "Error"
      : registrationStatsQuery.data?.paidRegistrations ?? 0,
},
{
  title: "Pending Payments",
  value: registrationStatsQuery.isLoading
    ? "..."
    : registrationStatsQuery.isError
      ? "Error"
      : registrationStatsQuery.data?.pendingPayments ?? 0,
},

  ];

  const hasError =
    coursesQuery.isError ||
    studentsQuery.isError ||
    instructorsQuery.isError ||
    registrationStatsQuery.isError;

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">University Reports</h1>
        <p className="mt-2 text-muted-foreground">
          View an overview of your university's current statistics.
        </p>
      </div>

      {hasError && (
        <p className="text-sm text-destructive">
          Some statistics could not be loaded.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.title}
            className="rounded-xl border bg-card p-6"
          >
            <h2 className="text-sm font-medium text-muted-foreground">
              {report.title}
            </h2>
            <p className="mt-3 text-3xl font-bold">{report.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
