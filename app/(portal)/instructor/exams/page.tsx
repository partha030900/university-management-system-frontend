
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getMySections } from "@/services/instructor.service";
import {
  createExam,
  getMyExams,
  type ExamType,
} from "@/services/exam.service";

export default function InstructorExamsPage() {
  const { accessToken } = useAuthStore();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ExamType>("MIDTERM");
  const [totalMarks, setTotalMarks] = useState("100");
  const [sectionId, setSectionId] = useState("");
  const [examDate, setExamDate] = useState("");

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
  data: examsResponse,
  isLoading: isExamsLoading,
  isError: isExamsError,
} = useQuery({
  queryKey: ["instructor-exams"],
  queryFn: () => getMyExams(accessToken!),
  enabled: !!accessToken,
});

const exams = examsResponse?.data ?? [];

  const examMutation = useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error("You are not authenticated.");
      }

      return createExam(
        {
          title: title.trim(),
          type,
          totalMarks: Number(totalMarks),
          sectionId: Number(sectionId),
          examDate,
        },
        accessToken
      );
    },
    onSuccess: () => {
      alert("Exam created successfully!");
      setTitle("");
      setType("MIDTERM");
      setTotalMarks("100");
      setSectionId("");
      setExamDate("");
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
    <div className="max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Exams Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create exams for your assigned sections.
        </p>
      </div>

      {!sections || sections.length === 0 ? (
        <p>No sections are assigned to you.</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            examMutation.mutate();
          }}
          className="space-y-5 rounded-xl border p-5"
        >
          <div className="space-y-2">
            <label htmlFor="exam-title" className="text-sm font-medium">
              Exam Title
            </label>
            <input
              id="exam-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Data Structures Midterm"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-type" className="text-sm font-medium">
              Exam Type
            </label>
            <select
              id="exam-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as ExamType)
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="total-marks" className="text-sm font-medium">
              Total Marks
            </label>
            <input
              id="total-marks"
              type="number"
              min="1"
              step="any"
              value={totalMarks}
              onChange={(event) => setTotalMarks(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-section" className="text-sm font-medium">
              Section
            </label>
            <select
              id="exam-section"
              value={sectionId}
              onChange={(event) => setSectionId(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select a section
              </option>

              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.course.code} — {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-date" className="text-sm font-medium">
              Exam Date
            </label>
            <input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={examMutation.isPending}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {examMutation.isPending ? "Creating Exam..." : "Create Exam"}
          </button>
        </form>
        
      )}
      
<div className="space-y-4">
  <h2 className="text-xl font-semibold">My Exams</h2>

  {isExamsLoading && <p>Loading exams...</p>}

  {isExamsError && (
    <p className="text-red-500">Failed to load exams.</p>
  )}

  {!isExamsLoading && !isExamsError && exams.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No exams have been created yet.
    </p>
  )}

  {exams.map((exam) => (
    <div key={exam.id} className="rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold">{exam.title}</h3>
          <p className="text-sm text-muted-foreground">
            {exam.section.course.code} — {exam.section.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Semester: {exam.section.semester.name}
          </p>
        </div>

        <span className="w-fit rounded-md bg-muted px-2 py-1 text-xs">
          {exam.type}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <p>Total marks: {exam.totalMarks}</p>
        <p>
          Exam date:{" "}
          {new Date(exam.examDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
