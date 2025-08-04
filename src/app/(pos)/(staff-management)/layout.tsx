import {StaffSubmenu} from '@/components/layout/submenus/StaffSubmenu'

export default function StaffManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StaffSubmenu />
      <div className="p-6">
        {children}
      </div>
    </>
  )
}