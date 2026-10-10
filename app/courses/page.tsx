
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function PublicCoursesPage() {
  const courses = [
    {
      code: "CSE101",
      title: "Introduction to Computer Science",
      description: "Learn programming fundamentals and core computing concepts.",
      credits: 3,
    },
    {
      code: "CSE201",
      title: "Advanced Computer Science",
      description: "Explore advanced computing concepts and techniques.",
      credits: 3,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Explore Our Courses
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Discover courses designed to build your knowledge and prepare you
          for your future career.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.code}
            className="rounded-xl border p-6 transition hover:shadow-md"
          >
            <BookOpen className="size-8 text-primary" />

            <h2 className="mt-4 text-xl font-semibold">
              {course.title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Course code: {course.code}
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              {course.description}
            </p>

            <p className="mt-3 text-sm font-medium">
              {course.credits} credits
            </p>
          </article>
        ))}
      </section>

      <div className="pb-12 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sign in to your account
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
