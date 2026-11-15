
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import {
  studentProfileSchema,
  type StudentProfileFormValues,
} from "@/lib/validations/student";
import {
  getAllPrograms,
  createMyStudentProfile,
  type Program,
} from "@/services/student.service";

export default function StudentProfileSetupPage() {
  const router = useRouter();

  const { accessToken, user } = useAuthStore();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
  });

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "STUDENT") {
      router.replace("/login");
      return;
    }

    const fetchPrograms = async () => {
      try {
        const response = await getAllPrograms(accessToken);
        setPrograms(response.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load programs";

        toast.error(message);
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, [accessToken, user, router]);

  const onSubmit = async (values: StudentProfileFormValues) => {
    if (!accessToken) {
      toast.error("Please log in again");
      router.replace("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await createMyStudentProfile(
        {
          studentId: values.studentId,
          name: values.name,
          programId: values.programId,
          ...(values.dateOfBirth && {
            dateOfBirth: values.dateOfBirth,
          }),
          ...(values.phone && {
            phone: values.phone,
          }),
        },
        accessToken
      );

      toast.success("Student profile created successfully");

      router.replace("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create student profile";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">
          Complete Your Student Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please provide your university information to continue.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Student ID
            </label>

            <input
              {...register("studentId")}
              placeholder="Enter your student ID"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.studentId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.studentId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              {...register("name")}
              placeholder="Enter your full name"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Program
            </label>

            <select
              {...register("programId")}
              disabled={isLoadingPrograms}
              className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {isLoadingPrograms
                  ? "Loading programs..."
                  : "Select your program"}
              </option>

              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.code})
                </option>
              ))}
            </select>

            {errors.programId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.programId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Date of Birth (Optional)
            </label>

            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number (Optional)
            </label>

            <input
              {...register("phone")}
              placeholder="Enter your phone number"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingPrograms}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Creating Profile..."
              : "Complete Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
