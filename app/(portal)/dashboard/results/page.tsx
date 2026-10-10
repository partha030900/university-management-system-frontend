"use client";

import { useQuery } from "@tanstack/react-query";
import {
  RefreshCw,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { getStudentById } from "@/services/student.service";

interface ApiResponse {
  success: boolean;
  message: string;
  data: unknown;
}

interface Course {
  code: string;
  title: string;
  credits: number;
}

interface Semester {
  name: string;
  year: number;
}

interface Section {
  course: Course;
  semester: Semester;
}

interface Registration {
  section: Section;
}

interface Exam {
  title: string;
  type: string;
  totalMarks: number;
  examDate: string;
}

interface Result {
  id: number;
  marks: number;
  grade: string;
  exam: Exam;
  registration: Registration;
}

async function getResults(
  studentId: number,
  accessToken: string
): Promise<Result[]> {
  const response = await apiFetch<ApiResponse>(
    `/results/student/${studentId}`,
    {
      method: "GET",
      token: accessToken,
    }
  );

  if (!Array.isArray(response.data)) {
    return [];
  }

  return response.data as Result[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatExamType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getGradeStyle(grade: string) {
  if (grade === "A_PLUS" || grade === "A") {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }

  if (grade.startsWith("B")) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  }

  if (grade.startsWith("C")) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }

  return "bg-muted text-muted-foreground";
}

export default function ResultsPage() {
  const { user, accessToken } = useAuthStore();

  const {
    data: studentResponse,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: () => getStudentById(user!.id, accessToken!),
    enabled: Boolean(user && accessToken),
  });

  const studentId = studentResponse?.data?.id;

  const {
    data: results,
    isLoading: isResultsLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["student-results", studentId],
    queryFn: () => getResults(studentId!, accessToken!),
    enabled: Boolean(studentId && accessToken),
  });

  const loading = isStudentLoading || isResultsLoading;

  const totalMarks =
    results?.reduce((sum, result) => sum + result.marks, 0) ?? 0;

  const totalPossible =
    results?.reduce(
      (sum, result) => sum + result.exam.totalMarks,
      0
    ) ?? 0;

  const average =
    totalPossible > 0
      ? (totalMarks / totalPossible) * 100
      : 0;

  const highestMarks =
    results?.length
      ? Math.max(...results.map((result) => result.marks))
      : 0;

  return (
    <main className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Academic Results
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track your examination performance and grades.
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3">
          <GraduationCap className="size-8 text-primary" />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border bg-muted/30"
            />
          ))}
        </div>
      ) : isStudentError ? (
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">
            Unable to load student profile
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page or sign in again.
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">Unable to load results</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Please try again."}
          </p>
          <Button
            className="mt-4"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="mr-2 size-4" />
            Retry
          </Button>
        </div>
      ) : !results?.length ? (
        <div className="rounded-xl border p-10 text-center">
          <BookOpen className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            No results available
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your results will appear here when they are available.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Exam Records
                </p>
                <BookOpen className="size-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-bold">
                {results.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Available examination results
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Average Score
                </p>
                <TrendingUp className="size-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-bold">
                {average.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across available result records
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Highest Marks
                </p>
                <Award className="size-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-bold">
                {highestMarks}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Marks in a single exam
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Total Marks
                </p>
                <GraduationCap className="size-5 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-bold">
                {totalMarks}
                <span className="text-base font-medium text-muted-foreground">
                  {" "}/ {totalPossible}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Obtained / maximum marks
              </p>
            </div>
          </section>

          {/* Student information */}
          <section className="rounded-xl border p-5">
            <h2 className="font-semibold">Student Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Student Name
                </p>
                <p className="mt-1 font-medium">
                  {studentResponse?.data?.name ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Student ID
                </p>
                <p className="mt-1 font-medium">
                  {studentResponse?.data?.studentId ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Program
                </p>
                <p className="mt-1 font-medium">
                  {studentResponse?.data?.program?.name ?? "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Results table */}
          <section className="overflow-hidden rounded-xl border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div>
                <h2 className="font-semibold">Examination Records</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your marks, grades, and examination details.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-5 py-4 font-medium">Course</th>
                    <th className="px-5 py-4 font-medium">Semester</th>
                    <th className="px-5 py-4 font-medium">Exam</th>
                    <th className="px-5 py-4 font-medium">Exam Date</th>
                    <th className="px-5 py-4 font-medium">Marks</th>
                    <th className="px-5 py-4 font-medium">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.id}
                      className="border-t transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {result.registration.section.course.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.registration.section.course.code}
                          {" · "}
                          {result.registration.section.course.credits} credits
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {result.registration.section.semester.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.registration.section.semester.year}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {result.exam.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatExamType(result.exam.type)}
                        </p>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(result.exam.examDate)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {result.marks} / {result.exam.totalMarks}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.exam.totalMarks > 0
                            ? `${(
                                (result.marks / result.exam.totalMarks) *
                                100
                              ).toFixed(1)}%`
                            : "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getGradeStyle(
                            result.grade
                          )}`}
                        >
                          {result.grade.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
