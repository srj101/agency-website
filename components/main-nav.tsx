"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const isAdmin = profile?.role === "admin" || profile?.role === "editor"

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
    {
      href: "/services",
      label: "Services",
      active: pathname === "/services" || pathname.startsWith("/services/"),
    },
    {
      href: "/blog",
      label: "Blog",
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-foreground font-semibold" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}

      {user ? (
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/auth/login">Sign In</Link>
        </Button>
      )}
    </nav>
  )
}
