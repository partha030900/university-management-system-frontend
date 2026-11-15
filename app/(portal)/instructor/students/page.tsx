
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getMyStudents } from "@/services/instructor.service";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function InstructorStudentsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read search and page values from URL
  const search = searchParams.get("search") ?? "";

  const pageSize = 10;
  const requestedPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  // Update search parameter in URL
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    // Reset pagination when searching
    params.delete("page");

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname
    );
  };

  // Fetch instructor's students
  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructor", "my-students"],
    queryFn: () => getMyStudents(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
  if (isError) {
    toast.error("Failed to load students. Please try again.");
  }
}, [isError]);

  // Filter students
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

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil((filteredRegistrations?.length ?? 0) / pageSize)
  );

  const currentPage = Math.min(requestedPage, totalPages);

  const paginatedRegistrations = filteredRegistrations?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Update page parameter in URL
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="mt-2 text-muted-foreground">
          View students enrolled in your assigned sections.
        </p>
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by student, ID, program, or course..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-md border bg-background px-4 py-2"
      />

      {/* Loading state */}
      {isLoading && <p>Loading students...</p>}

      {/* Error state */}
      {isError && (
        <p className="text-destructive">
          Failed to load students. Please try again.
        </p>
      )}

      {/* Students table and pagination */}
      {!isLoading && !isError && (
        <>
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
                {paginatedRegistrations?.map((registration) => (
                  <tr key={registration.id} className="border-t">
                    <td className="p-4">
                      {registration.student.studentId}
                    </td>

                    <td className="p-4">
                      {registration.student.name}
                    </td>

                    <td className="p-4">
                      {registration.student.program.name}
                    </td>

                    <td className="p-4">
                      {registration.section.course.code} —{" "}
                      {registration.section.course.title}
                    </td>

                    <td className="p-4">
                      {registration.section.name}
                    </td>
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

          {/* Pagination controls */}
          {filteredRegistrations &&
            filteredRegistrations.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                    className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                    className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </>
      )}
    </main>
  );
}
