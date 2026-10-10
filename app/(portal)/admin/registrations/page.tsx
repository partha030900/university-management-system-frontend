"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getAllRegistrations } from "@/services/registration.service";

export default function AdminRegistrationsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "registrations"],
    queryFn: () => getAllRegistrations(accessToken!),
    enabled: !!accessToken,
  });

  const filteredRegistrations = registrations?.filter((registration) => {
    const searchText = [
      registration.student.name,
      registration.student.studentId,
      registration.section.course.code,
      registration.section.course.title,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const paymentStatus = registration.payments.some(
      (payment) => payment.status === "PAID"
    )
      ? "PAID"
      : registration.payments.some(
            (payment) => payment.status === "PENDING"
          )
        ? "PENDING"
        : registration.payments.length > 0
          ? "FAILED"
          : "UNPAID";

    const matchesPayment =
      paymentFilter === "ALL" || paymentStatus === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Registration Management</h1>
        <p className="mt-2 text-muted-foreground">
          View student registrations and payment statuses.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border bg-background px-4 py-2"
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-md border bg-background px-4 py-2"
        >
          <option value="ALL">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="UNPAID">Unpaid</option>
        </select>
      </div>

      {isLoading && <p>Loading registrations...</p>}

      {isError && (
        <p className="text-destructive">Failed to load registrations.</p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-4">Registration ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Section</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Registered On</th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations?.map((registration) => {
                const paymentStatus = registration.payments.some(
                  (payment) => payment.status === "PAID"
                )
                  ? "PAID"
                  : registration.payments.some(
                        (payment) => payment.status === "PENDING"
                      )
                    ? "PENDING"
                    : registration.payments.length > 0
                      ? "FAILED"
                      : "UNPAID";

                return (
                  <tr key={registration.id} className="border-t">
                    <td className="p-4">{registration.id}</td>
                    <td className="p-4">
                      {registration.student.name}
                      <p className="text-xs text-muted-foreground">
                        {registration.student.studentId}
                      </p>
                    </td>
                    <td className="p-4">
                      {registration.section.course.code} —{" "}
                      {registration.section.course.title}
                    </td>
                    <td className="p-4">{registration.section.name}</td>
                    <td className="p-4">
                      <span
                        className={
                          paymentStatus === "PAID"
                            ? "rounded-full bg-green-100 px-2 py-1 text-green-800"
                            : paymentStatus === "PENDING"
                              ? "rounded-full bg-yellow-100 px-2 py-1 text-yellow-800"
                              : "rounded-full bg-red-100 px-2 py-1 text-red-800"
                        }
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(
                        registration.registeredAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}

              {filteredRegistrations?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No registrations found.
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