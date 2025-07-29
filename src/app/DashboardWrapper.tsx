import React from 'react'


const DashboardWrapper = ({children} : {children: React.ReactNode}) => {
  return (

    <div className={` flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
      <div className={`w-64 bg-gray-200 p-4`}>
        Sidebar
      </div>
      <div className={`flex-1 p-4`}>
        {children}
      </div>
    </div>
  )
}

export default DashboardWrapper
