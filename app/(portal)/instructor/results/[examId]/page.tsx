
"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createResult,
  getExamStudents,
  getExamPerformance,
} from "@/services/result.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function InstructorResultsPage() {
  const params = useParams();
  const examId = Number(params.examId);

  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const [marks, setMarks] = useState<Record<number, string>>({});

  // Fetch registered students
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exam-students", examId],
    queryFn: () => getExamStudents(examId, accessToken!),
    enabled: !!accessToken && Number.isInteger(examId) && examId > 0,
  });

  // Fetch exam performance
  const {
    data: performanceResponse,
    isLoading: isPerformanceLoading,
    isError: isPerformanceError,
  } = useQuery({
    queryKey: ["exam-performance", examId],
    queryFn: () => getExamPerformance(examId, accessToken!),
    enabled: !!accessToken && Number.isInteger(examId) && examId > 0,
  });

  // Save marks
  const resultMutation = useMutation({
    mutationFn: (data: {
      registrationId: number;
      examId: number;
      marks: number;
    }) => createResult(data, accessToken!),



    onSuccess: () => {
      toast.success("Student marks saved successfully!");

      queryClient.invalidateQueries({
        queryKey: ["exam-students", examId],
      });

      queryClient.invalidateQueries({
        queryKey: ["exam-performance", examId],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to save student marks.");
    },
  });

  // Performance error notification
  useEffect(() => {
    if (isPerformanceError) {
      toast.error("Failed to load exam performance statistics.");
    }
  }, [isPerformanceError]);

  if (isLoading) {
    return <p className="p-6">Loading exam students...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Failed to load exam students: {String(error)}
      </p>
    );
  }

  const exam = response?.data.exam;
  const students = response?.data.students ?? [];
  const performance = performanceResponse?.data;

  return (
    <div className="space-y-6 p-6">

      {/* Exam Information */}
      <div>
        <h1 className="text-2xl font-bold">Results Management</h1>

        {exam && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Exam: {exam.title}</p>
            <p>Type: {exam.type}</p>
            <p>Total Marks: {exam.totalMarks}</p>
          </div>
        )}
      </div>

      {/* Performance Dashboard */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Exam Performance Overview
        </h2>

        {isPerformanceLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading performance statistics...
          </p>
        ) : isPerformanceError ? (
          <p className="text-sm text-red-500">
            Failed to load performance statistics.
          </p>
        ) : performance ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Average Marks
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.averageMarks}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Total Students
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.totalStudents}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Passed Students
                </p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {performance.passedStudents}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Failed Students
                </p>
                <p className="mt-2 text-2xl font-bold text-red-500">
                  {performance.failedStudents}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Highest Marks
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.highestMarks ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Lowest Marks
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.lowestMarks ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Students Graded
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.studentsGraded}
                </p>
              </div>

              <div className="rounded-xl border p-5">
                <p className="text-sm text-muted-foreground">
                  Not Yet Graded
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {performance.studentsNotGraded}
                </p>
              </div>

            </div>
          </>
        ) : null}
      </div>

      {/* Registered Students and Marks Entry */}
      <div className="rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-semibold">
          Registered Students
        </h2>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students registered for this exam.
          </p>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.registrationId}
                className="rounded-lg border p-4"
              >
                <p className="font-medium">{student.name}</p>

                <p className="text-sm text-muted-foreground">
                  {student.studentId} — {student.email}
                </p>

                <p className="mt-2 text-sm">
                  Existing marks: {student.result?.marks ?? "Not entered"}
                </p>

                <p className="mt-1 text-sm font-medium">
                  Grade: {student.result?.grade ?? "Not assigned"}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max={exam?.totalMarks}
                    placeholder="Enter marks"
                    value={
                      marks[student.registrationId] ??
                      String(student.result?.marks ?? "")
                    }
                    onChange={(e) =>
                      setMarks((prev) => ({
                        ...prev,
                        [student.registrationId]: e.target.value,
                      }))
                    }
                    className="w-32 rounded-md border px-3 py-2 text-sm"
                  />

                  <button
                    onClick={() => {
                      const enteredValue =
                        marks[student.registrationId] ??
                        String(student.result?.marks ?? "");

                      if (!enteredValue.trim()) {
                        toast.error("Please enter the student's marks.");
                        return;
                      }

                      const numericMarks = Number(enteredValue);

                      if (!Number.isFinite(numericMarks) || numericMarks < 0) {
                        toast.error("Please enter valid marks.");
                        return;
                      }

                      if (numericMarks > (exam?.totalMarks ?? 0)) {
                        toast.error(
                          `Marks cannot exceed ${exam?.totalMarks ?? 0}.`
                        );
                        return;
                      }

                      resultMutation.mutate({
                        registrationId: student.registrationId,
                        examId,
                        marks: numericMarks,
                      });
                    }}
                    disabled={resultMutation.isPending}
                    className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                  >
                    Save Marks
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
