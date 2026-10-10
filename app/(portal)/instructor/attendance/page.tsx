"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getMySections } from "@/services/instructor.service";
import { getSectionStudents,createAttendance,} from "@/services/attendance.service";


export default function InstructorAttendancePage() {
  const { accessToken } = useAuthStore();
  const [selectedSectionId, setSelectedSectionId] =
    useState<number | null>(null);

    const [attendanceStatuses, setAttendanceStatuses] = useState<Record<number, "PRESENT" | "ABSENT" | "LATE">>({});

    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  const {
    data: sections,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructor-sections"],
    queryFn: () => getMySections(accessToken!),
    enabled: !!accessToken,
  });

  const {
  data: sectionData,
  isLoading: isStudentsLoading,
  isError: isStudentsError,
} = useQuery({
  queryKey: ["attendance-section-students", selectedSectionId],
  queryFn: () => getSectionStudents(selectedSectionId!, accessToken!),
  
  enabled: selectedSectionId !== null && !!accessToken,
});

const attendanceMutation = useMutation({
  mutationFn: async () => {
    if (!accessToken) {
      throw new Error("You are not authenticated.");
    }

    if (!sectionData || sectionData.students.length === 0) {
      throw new Error("No students are available.");
    }

    const studentsWithoutStatus = sectionData.students.filter(
      (registration) => !attendanceStatuses[registration.id]
    );

    if (studentsWithoutStatus.length > 0) {
      throw new Error("Please select attendance for every student.");
    }

    const results = await Promise.all(
      sectionData.students.map((registration) =>
        createAttendance(
          {
            registrationId: registration.id,
            date: attendanceDate,
            status: attendanceStatuses[registration.id],
          },
          accessToken
        )
      )
    );

    return results;
  },
  onSuccess: () => {
    alert("Attendance saved successfully!");
    setAttendanceStatuses({});
  },
  onError: (error) => {
    alert(error.message);
  },
});

  if (isLoading) {
    return <p className="p-6">Loading your sections...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Failed to load your sections.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Attendance Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a section to manage student attendance.
        </p>
      </div>

      {!sections || sections.length === 0 ? (
        <p>No sections are assigned to you.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const isSelected = selectedSectionId === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedSectionId(section.id)}
                className={`rounded-xl border p-5 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <h2 className="font-semibold">
                  {section.course.code}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {section.course.title}
                </p>

                <p className="mt-3 text-sm">
                  Section: {section.name}
                </p>

                <p className="mt-1 text-sm">
                  Enrolled students: {section._count.registrations}
                </p>

                <p className="mt-3 text-sm font-medium">
                  {isSelected ? "Selected" : "Select section →"}
                </p>
              </button>
            );
          })}
        </div>
      )}

{selectedSectionId !== null && (
  <div className="rounded-xl border p-5">
    <h2 className="text-lg font-semibold">
      Students — {sectionData?.section.course.code ?? "Selected Section"}
    </h2>

    <div className="mt-4">
  <label
    htmlFor="attendance-date"
    className="mb-2 block text-sm font-medium"
  >
    Attendance Date
  </label>

  <input
    id="attendance-date"
    type="date"
    value={attendanceDate}
    max={new Date().toISOString().split("T")[0]}
    onChange={(event) => setAttendanceDate(event.target.value)}
    className="rounded-md border bg-background px-3 py-2 text-sm"
  />
</div>

    {isStudentsLoading && (
      <p className="mt-4">Loading students...</p>
    )}

    {isStudentsError && (
      <p className="mt-4 text-red-500">
        Failed to load students for this section.
      </p>
    )}

    {sectionData && (
      <div className="mt-4 space-y-3">
        {sectionData.students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students are registered for this section.
          </p>
        ) : (
          sectionData.students.map((registration) => (
  <div
    key={registration.id}
    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <p className="font-medium">
        {registration.student.name}
      </p>

      <p className="text-sm text-muted-foreground">
        Program: {registration.student.program.name}
      </p>

      <p className="text-xs text-muted-foreground">
        Registration ID: {registration.id}
      </p>
    </div>

    <select
      value={attendanceStatuses[registration.id] ?? ""}
      onChange={(event) => {
        const status = event.target.value as
          | "PRESENT"
          | "ABSENT"
          | "LATE";

        setAttendanceStatuses((previous) => ({
          ...previous,
          [registration.id]: status,
        }));
      }}
      className="rounded-md border bg-background px-3 py-2 text-sm"
    >
      <option value="" disabled>
        Select status
      </option>
      <option value="PRESENT">Present</option>
      <option value="ABSENT">Absent</option>
      <option value="LATE">Late</option>
    </select>
  </div>
))
        )}
      </div>
    )}
    
    {sectionData && (
      <div className="mt-4 space-y-3">
        {sectionData.students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students are registered for this section.
          </p>
        ) : (
          sectionData.students.map((registration) => (
            // Keep your existing student card code here
            <div key={registration.id}>
              {/* Your student name and attendance dropdown */}
            </div>
          ))
        )}
      </div>
    )}

    {/* ADD THE SAVE BUTTON HERE */}
    <button
      type="button"
      onClick={() => attendanceMutation.mutate()}
      disabled={
        attendanceMutation.isPending ||
        !sectionData ||
        sectionData.students.length === 0
      }
      className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {attendanceMutation.isPending
        ? "Saving Attendance..."
        : "Save Attendance"}
    </button>

  </div>
)}
 
   

    </div>
  );
}