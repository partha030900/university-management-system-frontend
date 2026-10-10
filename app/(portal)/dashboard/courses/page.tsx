"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Users,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { getStudentById } from "@/services/student.service";
import { createRegistration } from "@/services/registration.service";
import { getAllSections } from "@/services/section.service";

export default function CoursesPage() {
  const { user, accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [registeringSectionId, setRegisteringSectionId] =
    useState<number | null>(null);

  // Fetch the logged-in student's profile
  const studentQuery = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: () => getStudentById(user!.id, accessToken!),
    enabled: Boolean(
      user && accessToken && user.role === "STUDENT"
    ),
  });

  // Fetch all available sections
  const sectionsQuery = useQuery({
    queryKey: ["sections"],
    queryFn: () => getAllSections(accessToken!),
    enabled: Boolean(accessToken),
  });

  // Register the student for a selected section
  const registrationMutation = useMutation({
    mutationFn: async (sectionId: number) => {
      const studentId = studentQuery.data?.data?.id;

      if (!studentId || !accessToken) {
        throw new Error(
          "Student profile or access token is missing."
        );
      }

      return createRegistration(
        studentId,
        sectionId,
        accessToken
      );
    },

    onMutate: (sectionId) => {
      setRegisteringSectionId(sectionId);
      setMessage("");
    },

    onSuccess: async (response) => {
      setMessage(
        response.message || "Registration successful!"
      );

      await queryClient.invalidateQueries({
        queryKey: ["sections"],
      });
    },

    onError: (error: Error) => {
      setMessage(error.message || "Registration failed.");
    },

    onSettled: () => {
      setRegisteringSectionId(null);
    },
  });

  // Authentication check
  if (!user || !accessToken) {
    return (
      <p className="p-6">
        Please log in to view courses.
      </p>
    );
  }

  if (user.role !== "STUDENT") {
    return (
      <p className="p-6">
        Course registration is available to student accounts only.
      </p>
    );
  }

  // Loading state
  if (studentQuery.isLoading || sectionsQuery.isLoading) {
    return (
      <p className="p-6">
        Loading available courses...
      </p>
    );
  }

  // Error state
  if (studentQuery.isError || sectionsQuery.isError) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600">
          {studentQuery.error?.message ||
            sectionsQuery.error?.message ||
            "Failed to load course information."}
        </p>

        <Button
          variant="outline"
          onClick={() => {
            void studentQuery.refetch();
            void sectionsQuery.refetch();
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const sections = sectionsQuery.data?.data ?? [];

  return (
    <main className="space-y-6 p-4 md:p-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Course Registration
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Browse available class sections and register for your courses.
        </p>
      </div>

      {/* Registration feedback */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border p-4 text-sm"
        >
          {message}
        </div>
      )}

      {/* Empty state */}
      {sections.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="font-semibold">
            No sections available
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            There are currently no sections to display.
          </p>
        </div>
      ) : (
        /* Section cards */
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const isRegistering =
              registeringSectionId === section.id;

            // Prevent simultaneous registration requests,
            // but show loading only on the selected card.
            const isAnotherRegistrationRunning =
              registrationMutation.isPending && !isRegistering;

            return (
              <article
                key={section.id}
                className="flex flex-col rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {section.course.code}
                  </span>
                </div>

                <h2 className="text-lg font-semibold">
                  {section.course.title}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Section: {section.name}
                </p>

                <div className="my-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />

                    <span>
                      {section.semester.name}{" "}
                      {section.semester.year}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />

                    <span>
                      Capacity: {section.capacity}
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    Course ID: {section.courseId}
                  </p>
                </div>

                {/* Register button */}
                <div className="mt-auto pt-3">
                  <Button
                    className="w-full"
                    disabled={
                      isRegistering ||
                      isAnotherRegistrationRunning ||
                      !studentQuery.data?.data?.id
                    }
                    onClick={() => {
                      registrationMutation.mutate(section.id);
                    }}
                  >
                    {isRegistering
                      ? "Registering..."
                      : "Register"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
