"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  History,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const items = [
    {
      title: "Clinical Dashboard",
      href: "/dashboard",
      icon: Home,
      isActive:
        pathname === "/dashboard" && (!currentTab || currentTab === "scan"),
    },
    {
      title: "Patient Analysis",
      href: "/dashboard?tab=scan",
      icon: Upload,
      isActive: pathname === "/dashboard" && currentTab === "scan",
    },
    {
      title: "Patient Records",
      href: "/dashboard?tab=history",
      icon: History,
      isActive: pathname === "/dashboard" && currentTab === "history",
    },
    {
      title: "Profile",
      href: "/dashboard?tab=profile",
      icon: User,
      isActive: pathname === "/dashboard" && currentTab === "profile",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      isActive: pathname === "/help",
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              item.isActive
                ? "bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-50"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
