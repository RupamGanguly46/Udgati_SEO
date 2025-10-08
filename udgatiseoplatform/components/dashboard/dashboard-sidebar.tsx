"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  Video,
  ImageIcon,
  TrendingUp,
  Code,
  Zap,
  Settings,
  HelpCircle,
  Menu,
  X,
  User,
  MessageSquare,
  Clock,
  Edit,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ProfileEditModal } from "./profile-edit-modal"

const navigationItems = [
  {
    title: "Dashboard Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Keyword Extraction",
    href: "/dashboard/keywords",
    icon: Search,
  },
  {
    title: "Video Optimization",
    href: "/dashboard/video",
    icon: Video,
  },
  {
    title: "Alt Text Generator",
    href: "/dashboard/images",
    icon: ImageIcon,
  },
  {
    title: "Competitor Analysis",
    href: "/dashboard/competitors",
    icon: TrendingUp,
  },
  {
    title: "Meta Tags",
    href: "/dashboard/meta-tags",
    icon: Code,
  },
]

const chatHistory = [
  { id: 1, title: "Website SEO Analysis", date: "2 hours ago" },
  { id: 2, title: "Keyword Research for Blog", date: "1 day ago" },
  { id: 3, title: "Competitor Analysis Report", date: "3 days ago" },
  { id: 4, title: "Meta Tags Optimization", date: "1 week ago" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userData, setUserData] = useState({ name: "Loading...", email: "Loading..." })
  const [showProfileEdit, setShowProfileEdit] = useState(false)

  useEffect(() => {
    console.log("[v0] Checking localStorage for user data...")
    const storedUser = localStorage.getItem("udgatiseo_user")
    console.log("[v0] Stored user data:", storedUser)

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("[v0] Parsed user data:", parsedUser)

        const displayName = parsedUser.name || parsedUser.firstName || "Set Your Name"
        const displayEmail = parsedUser.email || "Set Your Email"

        console.log("[v0] Setting display data:", { name: displayName, email: displayEmail })

        setUserData({
          name: displayName,
          email: displayEmail,
        })
      } catch (error) {
        console.error("[v0] Error parsing user data:", error)
        setUserData({ name: "Set Your Name", email: "Set Your Email" })
      }
    } else {
      console.log("[v0] No user data found in localStorage")
      setUserData({ name: "Set Your Name", email: "Set Your Email" })
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      console.log("[v0] Storage changed, reloading user data...")
      const storedUser = localStorage.getItem("udgatiseo_user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUserData({
            name: parsedUser.name || parsedUser.firstName || "Set Your Name",
            email: parsedUser.email || "Set Your Email",
          })
        } catch (error) {
          console.error("[v0] Error parsing updated user data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)

    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: newState },
      }),
    )
  }

  const handleProfileUpdate = (updatedData: { name: string; email: string }) => {
    setUserData(updatedData)
    const existingUser = localStorage.getItem("udgatiseo_user")
    let userToSave = updatedData

    if (existingUser) {
      try {
        const parsedUser = JSON.parse(existingUser)
        userToSave = { ...parsedUser, ...updatedData }
      } catch (error) {
        console.error("Error parsing existing user data:", error)
      }
    }

    localStorage.setItem("udgatiseo_user", JSON.stringify(userToSave))
  }

  const handleLogout = () => {
    localStorage.removeItem("udgatiseo_user")
    window.location.href = "/"
  }

  return (
    <>
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 opacity-80 hover:opacity-100"
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4 opacity-70" />}
      </Button>

      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border min-h-screen fixed transition-all duration-300 animate-slide-up mobile-hide z-40",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-6">
          <div className={cn("mb-6 animate-fade-in", isCollapsed && "hidden")}>
            <div
              className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/20 hover-lift transition-all duration-300 cursor-pointer group"
              onClick={() => setShowProfileEdit(true)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sidebar-primary to-sidebar-accent flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userData.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{userData.email}</p>
              </div>
              <Edit className="h-4 w-4 text-sidebar-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className={cn("mb-8 animate-fade-in", isCollapsed && "text-center")}>
            <h2 className="text-xl font-bold gradient-text animate-pulse-glow">{isCollapsed ? "US" : "UdgatiSEO"}</h2>
            {!isCollapsed && <p className="text-xs text-sidebar-foreground/60">AI SEO Platform</p>}
          </div>

          <div className="mb-6 animate-scale-in">
            <Button
              asChild
              className={cn(
                "w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover-lift transition-all duration-300 border-0 opacity-100",
                "!bg-gradient-to-r !from-blue-600 !to-green-600 !text-white",
                pathname === "/dashboard/ai-optimize" && "ring-2 ring-blue-500/50 animate-pulse-glow",
                isCollapsed ? "justify-center px-2 h-12" : "justify-start h-12 px-4 text-sm",
              )}
              style={{
                background: "linear-gradient(to right, rgb(37, 99, 235), rgb(22, 163, 74))",
                color: "white",
              }}
            >
              <Link href="/dashboard/ai-optimize" className="flex items-center w-full text-white">
                <Zap
                  className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110 flex-shrink-0 text-white",
                    !isCollapsed && "mr-3",
                  )}
                />
                {!isCollapsed && <span className="font-medium truncate text-white">AI Optimization</span>}
              </Link>
            </Button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover-lift animate-slide-up",
                    isActive && "bg-gray-200 dark:bg-gray-800/70 text-gray-900 dark:text-white font-medium",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn("h-4 w-4 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")}
                    />
                    {!isCollapsed && item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>

          {!isCollapsed && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Recent Chats</h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover-lift"
                  >
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{chat.title}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{chat.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={cn(
              "mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-fade-in",
              isCollapsed && "pt-4",
            )}
          >
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover-lift",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
            >
              <Link href="/dashboard/settings">
                <Settings
                  className={cn("h-4 w-4 transition-transform group-hover:rotate-90", !isCollapsed && "mr-3")}
                />
                {!isCollapsed && "Settings"}
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover-lift",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
            >
              <Link href="/dashboard/help">
                <HelpCircle
                  className={cn("h-4 w-4 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")}
                />
                {!isCollapsed && "Help & Support"}
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-600 transition-all duration-300 hover-lift border border-red-200 dark:border-red-800 mt-2",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
            >
              <LogOut className={cn("h-4 w-4 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")} />
              {!isCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      <ProfileEditModal
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        userData={userData}
        onSave={handleProfileUpdate}
      />
    </>
  )
}
