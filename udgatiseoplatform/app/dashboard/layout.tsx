"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useState, useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient">
      <DashboardSidebar />
      <div className={`transition-all duration-300 mobile-full mobile-ml-0 ${isCollapsed ? "ml-16" : "ml-64"}`}>
        {children}
      </div>
    </div>
  )
}
