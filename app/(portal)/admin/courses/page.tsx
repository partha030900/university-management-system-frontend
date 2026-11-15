"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import {
  getAllCourses,
  createCourse,
} from "@/services/course.service";
import type { CreateCourseInput } from "@/services/course.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createCourseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  credits: z.number().positive("Credits must be greater than zero"),
  fee: z.number().positive("Course fee must be greater than zero"),
});

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      credits: 3,
      fee: 100,
    },
  });

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: getAllCourses,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCourseInput) =>
      createCourse(
        {
          ...data,
          description: data.description || undefined,
        },
        accessToken!
      ),

    onSuccess: () => {
      toast.success("Course created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["admin", "courses"],
      });
      reset();
      setShowForm(false);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });

  const onSubmit = (data: CreateCourseInput) => {
    if (!accessToken) {
      toast.error("Please log in as an admin first");
      return;
    }

    createMutation.mutate(data);
  };

  const filteredCourses = courses?.filter((course) => {
    const searchTerm = search.toLowerCase();

    return (
      course.code.toLowerCase().includes(searchTerm) ||
      course.title.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <main className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Manage university courses.
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Course"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 max-w-2xl space-y-4 rounded-lg border p-6"
        >
          <h2 className="text-xl font-semibold">
            Create New Course
          </h2>

          <div>
            <Label htmlFor="code">Course Code</Label>
            <Input
              id="code"
              placeholder="e.g. CSE401"
              {...register("code")}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">
                {errors.code.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              placeholder="e.g. Software Engineering"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Course description"
              {...register("description")}
            />
          </div>

          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              step="0.5"
              {...register("credits", { valueAsNumber: true })}
            />
            {errors.credits && (
              <p className="mt-1 text-sm text-red-500">
                {errors.credits.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fee">Course Fee</Label>
            <Input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              {...register("fee", { valueAsNumber: true })}
            />
            {errors.fee && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fee.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Course"}
          </Button>
        </form>
      )}

      <div className="mt-8">
        <Input
          placeholder="Search by course code or title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-4 max-w-md"
        />

        {isLoading && (
          <p className="py-6 text-muted-foreground">
            Loading courses...
          </p>
        )}

        {isError && (
          <p className="py-6 text-red-500">
            {error.message || "Failed to load courses"}
          </p>
        )}

        {!isLoading && !isError && filteredCourses?.length === 0 && (
          <p className="py-6 text-muted-foreground">
            No courses found.
          </p>
        )}

        {!isLoading && !isError && filteredCourses && filteredCourses.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4">Course Code</th>
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Credits</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-t">
                    <td className="p-4 font-medium">
                      {course.code}
                    </td>
                    <td className="p-4">{course.title}</td>
                    <td className="p-4">{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
