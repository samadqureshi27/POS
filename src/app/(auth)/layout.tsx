export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* No navbar or sidebar here - just the auth content */}
      {children}
    </div>
  )
}