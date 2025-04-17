import type React from "react"
import { SidebarNav } from "@/app/admin/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"

export const metadata = {
  title: "Admin Panel | Agency Website",
  description: "Manage your website content.",
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
  },
  {
    title: "Services",
    href: "/admin/services",
  },
  {
    title: "Categories",
    href: "/admin/categories",
  },
  {
    title: "Contact Submissions",
    href: "/admin/contacts",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold">
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <SidebarNav items={navItems} />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
