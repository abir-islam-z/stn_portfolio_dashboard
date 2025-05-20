import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/redux/hooks"

export function AppLayout() {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Sidebar />
      <div className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "lg:ml-64" : "lg:ml-20", "ml-0")}>
        <Header />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
