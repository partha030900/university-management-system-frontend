"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, RefreshCw, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  getMyRegistrations,
  createCheckoutSession,
} from "@/services/registration.service";

export default function PaymentsPage() {
  const { user, accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const registrationsQuery = useQuery({
    queryKey: ["my-registrations", user?.id],
    queryFn: () => getMyRegistrations(accessToken!),
    enabled: Boolean(user && accessToken && user.role === "STUDENT"),
  });

  const paymentMutation = useMutation({
    mutationFn: (registrationId: number) =>
      createCheckoutSession(registrationId, accessToken!),

    onSuccess: (response) => {
      const checkoutUrl = response.data.checkoutUrl;

      if (!checkoutUrl) {
        setMessage("Checkout URL was not returned by the server.");
        return;
      }

      window.location.href = checkoutUrl;
    },

    onError: (error: Error) => {
      setMessage(error.message || "Could not start checkout.");
    },
  });

  if (!user || !accessToken) {
    return <p className="p-6">Please log in to view payments.</p>;
  }

  if (user.role !== "STUDENT") {
    return <p className="p-6">Payments are available to student accounts only.</p>;
  }

  if (registrationsQuery.isLoading) {
    return <p className="p-6">Loading your registrations...</p>;
  }

  if (registrationsQuery.isError) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-red-600">
          {registrationsQuery.error.message}
        </p>
        <Button
          variant="outline"
          onClick={() => void registrationsQuery.refetch()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const registrations = registrationsQuery.data?.data ?? [];

  return (
    <main className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your registered courses and their payment status.
        </p>
      </div>

      {message && (
        <p role="alert" className="rounded-lg border p-4 text-sm text-red-600">
          {message}
        </p>
      )}

      {registrations.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="font-semibold">No registrations found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Register for a course before making a payment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {registrations.map((registration) => {
            const isPaid = registration.payments.some(
              (payment) => payment.status === "PAID"
            );

            const isPaying =
              paymentMutation.isPending &&
              paymentMutation.variables === registration.id;

            return (
              <article
                key={registration.id}
                className="flex flex-col rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {registration.section.course.code}
                  </span>
                </div>

                <h2 className="text-lg font-semibold">
                  {registration.section.course.title}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Section: {registration.section.name}
                </p>

                <p className="mt-4 text-sm">
                  Registration ID: {registration.id}
                </p>

                <p className="mt-2 text-sm">
                  Payment status:{" "}
                  <span className={isPaid ? "font-semibold text-green-600" : "font-semibold"}>
                    {isPaid
                      ? "Paid"
                      : registration.payments.some(
                            (payment) => payment.status === "PENDING"
                          )
                        ? "Pending"
                        : "Unpaid"}
                  </span>
                </p>

                <div className="mt-auto pt-5">
                  {isPaid ? (
                    <Button disabled className="w-full">
                      Already Paid
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={paymentMutation.isPending}
                      onClick={() => {
                        setMessage("");
                        paymentMutation.mutate(registration.id);
                      }}
                    >
                      {isPaying ? "Redirecting..." : "Pay Now"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
