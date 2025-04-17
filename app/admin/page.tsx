"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getRecentContacts } from "./dashboard-actions"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    postsCount: 0,
    servicesCount: 0,
    contactsCount: 0,
    usersCount: 0,
  })
  const [recentContacts, setRecentContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, contactsData] = await Promise.all([getDashboardStats(), getRecentContacts()])

        setStats(statsData)
        setRecentContacts(contactsData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your website.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.postsCount}</div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/admin/blog">View All</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.servicesCount}</div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/admin/services">View All</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.contactsCount}</div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/admin/contacts">View All</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usersCount}</div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/admin/users">View All</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">Recent Contact Submissions</h2>
            <div className="mt-4 space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardHeader>
                      <CardTitle>{contact.name}</CardTitle>
                      <CardDescription>{contact.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{contact.message}</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleString()}</p>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No recent contact submissions.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
