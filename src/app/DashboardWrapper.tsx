import React from 'react'
import Navbar from '@/app/(components)/Navbar';
// import SecondNavbar from '@/app/(components)/SecondNavbar'; 
import Sidebar from '@/app/(components)/Sidebar';


// const DashboardWrapper = ({children} : {children: React.ReactNode}) => {
//   return (

//     <div className={` flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
//       Sidebar
//       <main>
//         <div className={` flex flex-col w-full h-full py-7 px-9 bg-gray-200 p-4 md:pl-24`}></div>

//         <Navbar></Navbar>
//       </main>
//         {children}
//       </div>
//   )
// }
function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* <div className={` flex flex-col w-full h-full py-7 px-9 bg-gray-200 p-4 md:pl-24`}></div> */}
      <Navbar title="Home" />
      {/* <SecondNavbar /> */}               
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

export default DashboardWrapper
