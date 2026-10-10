"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarLink({
  href,
  icon: Icon,
  label,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}