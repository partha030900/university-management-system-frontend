"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  ClipboardCheck,
  FileText,
  Receipt,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";
import SidebarLink from "@/components/dashboard/sidebar-link";

export default function Sidebar() {
 const router = useRouter();

const { user, logout } = useAuthStore();


  return (
    <aside className="hidden min-h-screen w-64 border-r bg-muted/30 p-4 md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          University System
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {user?.role} Portal
        </p>
      </div>

      <nav className="space-y-2">
        

        {user?.role === "STUDENT" && (
  <>
    <SidebarLink
  href="/dashboard"
  icon={LayoutDashboard}
  label="Dashboard"
/>

   <SidebarLink
  href="/dashboard/profile"
  icon={User}
  label="My Profile"
/>
   <SidebarLink
  href="/dashboard/courses"
  icon={BookOpen}
  label="Courses"
/>

    <SidebarLink
  href="/dashboard/attendance"
  icon={ClipboardCheck}
  label="Attendance"
/>

   <SidebarLink
  href="/dashboard/results"
  icon={FileText}
  label="Results"
/>

    <SidebarLink
  href="/dashboard/transcript"
  icon={FileText}
  label="Transcript"
/>

   <SidebarLink
  href="/dashboard/payments"
  icon={Receipt}
  label="Payments"
/>
  </>
)}

        {user?.role === "INSTRUCTOR" && (
  <>
    <SidebarLink
  href="/instructor"
  icon={LayoutDashboard}
  label="Dashboard"
/>

<SidebarLink
  href="/instructor/sections"
  icon={BookOpen}
  label="My Sections"
/>

<SidebarLink
  href="/instructor/attendance"
  icon={ClipboardCheck}
  label="Attendance"
/>

<SidebarLink
  href="/instructor/exams"
  icon={FileText}
  label="Exams"
/>

<SidebarLink
  href="/instructor/students"
  icon={Users}
  label="My Students"
/>

  </>
)}

        {user?.role === "ADMIN" && (
  <>
    <SidebarLink
  href="/admin"
  icon={LayoutDashboard}
  label="Dashboard"
/>

<SidebarLink
  href="/admin/students"
  icon={Users}
  label="Students"
/>

<SidebarLink
  href="/admin/courses"
  icon={BookOpen}
  label="Courses"
/>

 <SidebarLink
  href="/admin/registrations"
  icon={ClipboardCheck}
  label="Registrations"
/>

<SidebarLink
  href="/admin/reports"
  icon={BarChart3}
  label="Reports"
/>
  </>
)}

      </nav>
      <div className="mt-8 border-t pt-4">
 <button
  type="button"
  className="w-full rounded-md px-3 py-2 text-left hover:bg-muted"
  onClick={async () => {
    await logout();
    router.replace("/login");
  }}
>
  <LogOut className="h-4 w-4" />
  Logout
</button>
</div>
    </aside>
  );
}