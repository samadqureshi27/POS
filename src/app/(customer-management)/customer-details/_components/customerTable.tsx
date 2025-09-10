// components/CustomerTable.tsx
"use client";

import React from 'react';
import { ProfilePicture, StarRating } from './Star&customer';
import { CustomerItem } from '@/types/customer-details';

interface CustomerTableProps {
    customers: CustomerItem[];
    searchTerm: string;
    onCustomerClick: (customerId: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    searchTerm,
    onCustomerClick
}) => {
    return (
        <div className="bg-gray-50 md:bg-gray-50 rounded-sm border border-gray-300 max-w-[100vw] shadow-sm overflow-x-auto responsive-customer-table">
            <div className="table-container">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-white border-b text-gray-500 border-gray-200 py-50 sticky top-0 z-10">
                        <tr>
                            <th className="relative px-4 py-3 text-left w-40">
                                Name
                            </th>
                            <th className="relative px-4 py-3 text-left w-36">
                                Contact
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-52">
                                Email
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-36">
                                Feedback Rating
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-28">
                                Total Orders
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-28">
                                Birthdate
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-44">
                                Profile Created
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                            <th className="relative px-4 py-3 text-left w-44">
                                Device
                                <span className="absolute left-0 top-[15%] h-[70%] w-[1.5px] bg-gray-300"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-gray-500 divide-gray-300">
                        {customers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    {searchTerm
                                        ? "No customers match your search criteria."
                                        : "No customers found."}
                                </td>
                            </tr>
                        ) : (
                            customers.map((item) => (
                                <tr
                                    key={item.Customer_ID}
                                    onClick={() => onCustomerClick(item.Customer_ID)}
                                    className="bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-8 whitespace-nowrap text-sm card-name-cell" data-label="Name">
                                        <div className="name-content flex items-center gap-2">
                                            <ProfilePicture name={item.Name} />
                                            <span className="font-medium">{item.Name}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Contact">
                                        {item.Contact}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Email">
                                        {item.Email}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap card-rating-cell" data-label="Feedback Rating">
                                        <div className="rating-content">
                                            <StarRating rating={item.Feedback_Rating} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Total Orders">
                                        {item.Total_Orders}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Birthdate">
                                        {item.Birthdate}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm" data-label="Profile Created">
                                        {item.Profile_Creation_Date}
                                    </td>
                                    <td className="px-4 text-black py-4 whitespace-nowrap text-sm" data-label="Device">
                                        {item.Device}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;