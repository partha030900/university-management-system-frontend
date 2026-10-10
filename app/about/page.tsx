
import Link from "next/link";
import { BookOpen, Users, GraduationCap } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Academic Programs",
    description:
      "Explore courses and academic opportunities across different fields.",
  },
  {
    icon: Users,
    title: "Student Community",
    description:
      "Support collaboration between students, instructors, and administrators.",
  },
  {
    icon: GraduationCap,
    title: "Student Success",
    description:
      "Keep academic information organized and make progress easier to track.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          About Our University
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Our University Management System brings academic information and
          essential university services together in one convenient platform.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border p-6">
            <Icon className="size-9 text-primary" />

            <h2 className="mt-4 text-xl font-semibold">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="pb-16 text-center">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>

        <p className="mt-2 text-muted-foreground">
          Sign in to access your university dashboard.
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sign In
        </Link>
      </section>
    </main>
  );
}
