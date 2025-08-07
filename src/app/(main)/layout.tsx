import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="branch-management-layout">
      {/* Add any menu-management specific layout elements here */}
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;