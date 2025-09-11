// hooks/useFileUpload.ts
import { useState, useRef } from 'react';

export const useFileUpload = (onFileSelect: (file: File) => void) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            onFileSelect(file);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            onFileSelect(file);
        }
    };

    return {
        dragActive,
        fileInputRef,
        handleDrag,
        handleDrop,
        handleClickUpload,
        handleFileInputChange,
    };
};