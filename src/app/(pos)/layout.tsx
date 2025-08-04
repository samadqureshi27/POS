import DashboardWrapper from '@/components/layout/submenus/DashboardWrapper'
import POSSubmenu from '@/components/layout/submenus/POSSubmenu'

export default function POSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardWrapper showSubmenu={true}>
      <POSSubmenu />
      <div className="p-6">
        {children}
      </div>
    </DashboardWrapper>
  )
}