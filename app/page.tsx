
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Explore academic courses and course information.",
  },
  {
    icon: GraduationCap,
    title: "Academic Progress",
    description: "Access academic results, attendance, and transcripts.",
  },
  {
    icon: Users,
    title: "One Connected Platform",
    description: "Bring students, instructors, and administrators together.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          UniPortal
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/courses" className="hover:text-primary">
            Courses
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <section className="px-6 py-20 text-center sm:py-28">
        <p className="font-medium text-primary">
          Welcome to UniPortal
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Your University, Connected.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          Access courses, track academic progress, and manage university
          activities through one convenient platform.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Explore Courses <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/login"
            className="rounded-md border px-5 py-3 text-sm font-medium hover:bg-accent"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border p-6">
            <Icon className="size-9 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} UniPortal. All rights reserved.
      </footer>
    </main>
  );
}
