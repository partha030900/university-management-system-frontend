"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getMyStudents } from "@/services/instructor.service";

export default function InstructorStudentsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [search, setSearch] = useState("");

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructor", "my-students"],
    queryFn: () => getMyStudents(accessToken!),
    enabled: !!accessToken,
  });

  const filteredRegistrations = registrations?.filter((registration) => {
    const searchText = [
      registration.student.name,
      registration.student.studentId,
      registration.student.program.name,
      registration.section.course.code,
      registration.section.course.title,
      registration.section.name,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="mt-2 text-muted-foreground">
          View students enrolled in your assigned sections.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search by student, ID, program, or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border bg-background px-4 py-2"
      />

      {isLoading && <p>Loading students...</p>}

      {isError && (
        <p className="text-destructive">
          Failed to load students. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-4">Student ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Program</th>
                <th className="p-4">Course</th>
                <th className="p-4">Section</th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations?.map((registration) => (
                <tr key={registration.id} className="border-t">
                  <td className="p-4">
                    {registration.student.studentId}
                  </td>
                  <td className="p-4">{registration.student.name}</td>
                  <td className="p-4">
                    {registration.student.program.name}
                  </td>
                  <td className="p-4">
                    {registration.section.course.code} —{" "}
                    {registration.section.course.title}
                  </td>
                  <td className="p-4">{registration.section.name}</td>
                </tr>
              ))}

              {filteredRegistrations?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}