// components/ProfilePicture.tsx
import React from 'react';

interface ProfilePictureProps {
    name: string;
    size?: "small" | "large";
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
    name,
    size = "large"
}) => {
    const getInitials = (fullName: string) => {
        const names = fullName.split(" ");
        if (names.length >= 2) {
            return names[0][0] + names[1][0];
        }
        return names[0][0] + (names[0][1] || "");
    };

    const sizeClasses =
        size === "large" ? "w-12 h-12 text-lg" : "w-10 h-10 text-base font-light";

    return (
        <div
            className={`${sizeClasses} bg-[#2c2c2c] rounded-full flex items-center justify-center text-white`}
        >
            {getInitials(name).toUpperCase()}
        </div>
    );
};