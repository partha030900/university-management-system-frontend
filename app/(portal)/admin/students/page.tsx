
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { getAllStudents, getAllPrograms, createStudent } from "@/services/student.service";
import type { AdminCreateStudentInput } from "@/services/student.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createStudentSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Student name is required"),
  programId: z.number().int().positive("Select a program"),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
});

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminCreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      email: "",
      password: "",
      studentId: "",
      name: "",
      programId: 0,
      dateOfBirth: "",
      phone: "",
    },
  });

  // Fetch students
  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: () => getAllStudents(accessToken!),
    enabled: !!accessToken,
  });

  // Fetch programs
  const {
    data: programsResponse,
    isLoading: programsLoading,
  } = useQuery({
    queryKey: ["admin", "programs"],
    queryFn: () => getAllPrograms(accessToken!),
    enabled: !!accessToken,
  });

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: (data: AdminCreateStudentInput) =>
      createStudent(
        {
          ...data,
          dateOfBirth: data.dateOfBirth || undefined,
          phone: data.phone || undefined,
        },
        accessToken!
      ),

    onSuccess: () => {
      toast.success("Student account created successfully!");

      queryClient.invalidateQueries({
        queryKey: ["admin", "students"],
      });

      reset();
      setShowForm(false);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    },
  });

  const onSubmit = (data: AdminCreateStudentInput) => {
    createMutation.mutate(data);
  };

  const filteredStudents = students?.filter((student) =>
    `${student.name} ${student.studentId} ${student.program.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="mt-2 text-muted-foreground">
            Manage university students.
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Student"}
        </Button>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border p-6"
        >
          <h2 className="text-xl font-semibold">Create Student Account</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" {...register("studentId")} />
              {errors.studentId && (
                <p className="text-sm text-destructive">
                  {errors.studentId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programId">Program</Label>
              <select
                id="programId"
                {...register("programId", { valueAsNumber: true })}
                className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
                disabled={programsLoading}
              >
                <option value={0}>Select a program</option>

                {programsResponse?.data.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>

              {errors.programId && (
                <p className="text-sm text-destructive">
                  {errors.programId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          {programsLoading && (
            <p className="text-sm text-muted-foreground">
              Loading programs...
            </p>
          )}

          {!programsLoading && !programsResponse?.data.length && (
            <p className="text-sm text-destructive">
              No programs available. Please create a program first.
            </p>
          )}

          <Button
            type="submit"
            disabled={createMutation.isPending || programsLoading || !programsResponse?.data.length}
          >
            {createMutation.isPending ? "Creating..." : "Create Student"}
          </Button>
        </form>
      )}

      {/* Search */}
      <Input
        type="text"
        placeholder="Search by name, student ID, or program..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-md"
      />

      {/* Students Table */}
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
