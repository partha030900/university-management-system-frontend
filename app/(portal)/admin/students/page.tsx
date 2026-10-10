"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getAllStudents } from "@/services/student.service";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: students, isLoading, isError } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: () => getAllStudents(accessToken!),
    enabled: !!accessToken,
  });

  const filteredStudents = students?.filter((student) =>
    `${student.name} ${student.studentId} ${student.program.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="mt-2 text-muted-foreground">
          Manage university students.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search by name, student ID, or program..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border bg-background px-4 py-2 sm:max-w-md"
      />

      {isLoading && <p>Loading students...</p>}

      {isError && (
        <p className="text-destructive">Failed to load students.</p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Program</th>
                <th className="p-4">Phone</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents?.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="p-4">{student.studentId}</td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.program.name}</td>
                  <td className="p-4">{student.phone ?? "—"}</td>
                </tr>
              ))}

              {filteredStudents?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
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