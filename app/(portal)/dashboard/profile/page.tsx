"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UserRound,
  GraduationCap,
  IdCard,
  Phone,
  CalendarDays,
  BookOpen,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { getStudentById } from "@/services/student.service";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="size-5 text-primary" />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 wrap-break-word font-medium">
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, accessToken } = useAuthStore();

  const {
    data: studentResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: () => getStudentById(user!.id, accessToken!),
    enabled: Boolean(user && accessToken),
  });

  const student = studentResponse?.data;

  return (
    <main className="space-y-8 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            View your personal and academic information.
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3">
          <UserRound className="size-8 text-primary" />
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-36 animate-pulse rounded-xl border bg-muted/30" />
          <div className="h-64 animate-pulse rounded-xl border bg-muted/30" />
        </div>
      ) : isError ? (
        /* Error state */
        <section className="rounded-xl border p-6">
          <h2 className="font-semibold">
            Unable to load your profile
          </h2>

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
        </section>
      ) : !student ? (
        /* Empty state */
        <section className="rounded-xl border p-8 text-center">
          <UserRound className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-3 font-semibold">
            Student profile not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have a student profile yet.
          </p>
        </section>
      ) : (
        <>
          {/* Profile overview */}
          <section className="rounded-xl border p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserRound className="size-10 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold">
                  {student.name}
                </h2>

                <p className="mt-1 text-muted-foreground">
                  Student ID: {student.studentId}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <GraduationCap className="size-4" />
                  Student
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
            </div>
          </section>

          {/* Personal information */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your registered personal details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Full Name"
                value={student.name}
                icon={UserRound}
              />

              <InfoItem
                label="Student ID"
                value={student.studentId}
                icon={IdCard}
              />

              <InfoItem
                label="Phone Number"
                value={student.phone}
                icon={Phone}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(student.dateOfBirth)}
                icon={CalendarDays}
              />
            </div>
          </section>

          {/* Academic information */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">
                Academic Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Information about your enrolled program.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Program Name"
                value={student.program?.name}
                icon={GraduationCap}
              />

              <InfoItem
                label="Program Code"
                value={student.program?.code}
                icon={BookOpen}
              />

              <InfoItem
                label="Program Duration"
                value={
                  student.program?.duration
                    ? `${student.program.duration} years`
                    : "Not provided"
                }
                icon={CalendarDays}
              />

              <InfoItem
                label="Department ID"
                value={student.program?.departmentId}
                icon={IdCard}
              />
            </div>
          </section>
        </>
      )}
    </main>
  );
}