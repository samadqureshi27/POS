import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - POS System',
  description: 'Admin and Manager Login',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}