import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#d6d7d7]">
      <Sidebar />
      <div className="md:pl-56 pb-20 md:pb-0">
        {children}
      </div>
      <MobileNav />
    </div>
  )
}
