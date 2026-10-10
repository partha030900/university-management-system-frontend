"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getMySections } from "@/services/instructor.service";

export default function InstructorPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    data: sections,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructor", "my-sections"],
    queryFn: () => getMySections(accessToken!),
    enabled: !!accessToken,
  });

  const totalStudents =
    sections?.reduce(
      (total, section) => total + section._count.registrations,
      0
    ) ?? 0;

  const totalExams =
    sections?.reduce(
      (total, section) => total + section._count.exams,
      0
    ) ?? 0;

  const stats = [
    { title: "My Sections", value: sections?.length ?? 0 },
    { title: "Enrolled Students", value: totalStudents },
    { title: "Exams", value: totalExams },
  ];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the Instructor Dashboard.
        </p>
      </div>

      {isLoading && <p>Loading your dashboard...</p>}

      {isError && (
        <p className="text-destructive">
          Failed to load your sections. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">My Sections</h2>

            {sections?.length === 0 ? (
              <p className="rounded-xl border p-5 text-muted-foreground">
                No sections have been assigned to you yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sections?.map((section) => (
                  <div
                    key={section.id}
                    className="space-y-3 rounded-xl border p-5"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {section.course.code} — {section.course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Section: {section.name}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Enrolled students
                      </span>
                      <span className="font-medium">
                        {section._count.registrations} / {section.capacity}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exams</span>
                      <span className="font-medium">
                        {section._count.exams}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Credits: {section.course.credits}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}