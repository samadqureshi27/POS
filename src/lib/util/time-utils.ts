// utils/timeUtils.ts
export const getOperatingStatus = (openingTime: string, closingTime: string) => {
    if (!openingTime || !closingTime) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime =
        parseInt(openingTime.split(":")[0]) * 60 +
        parseInt(openingTime.split(":")[1]);
    const closeTime =
        parseInt(closingTime.split(":")[0]) * 60 +
        parseInt(closingTime.split(":")[1]);

    const isOpen = currentTime >= openTime && currentTime <= closeTime;

    return {
        isOpen,
        status: isOpen ? "Open Now" : "Closed",
        color: isOpen ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100",
    };
};