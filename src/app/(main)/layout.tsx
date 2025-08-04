import DashboardWrapper from '@/components/layout/submenus/DashboardWrapper'


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardWrapper showSubmenu={false}>{children}</DashboardWrapper>
}