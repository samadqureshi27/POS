import React from "react";
import { Package, Star, Zap, Crown, CreditCard } from "lucide-react";

interface PlanIconProps {
    plan: string;
}

export const PlanIcon: React.FC<PlanIconProps> = ({ plan }) => {
    switch (plan) {
        case "Basic":
            return <Package className="text-blue-500" size={20} />;
        case "Standard":
            return <Star className="text-green-500" size={20} />;
        case "Pro":
            return <Zap className="text-purple-500" size={20} />;
        case "Ultimate":
            return <Crown className="text-yellow-500" size={20} />;
        case "Trial":
            return <CreditCard className="text-gray-500" size={20} />;
        default:
            return <Package className="text-blue-500" size={20} />;
    }
};