import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;
    searchClassName?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    showSearch = true,
    searchClassName = "",
    className = "",
}) => {
    return (
        <>
            {showSearch && onSearchChange && (
                <div className={`relative flex-1 ${searchClassName} ${className}`}>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-[40px] pr-10 pl-4 bg-white border border-[#d5d5dd] rounded-sm text-sm placeholder:text-gray-400 focus:border-[#d5d5dd] focus:ring-0 focus:outline-none"
                    />
                    <Search
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                </div>
            )}
        </>
    );
};

export default SearchBar;
