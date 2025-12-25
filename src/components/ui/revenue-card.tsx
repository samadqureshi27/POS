import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react"
import { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/util/formatters"

interface RevenueCardProps {
    title: string
    amount: string | number
    percentage?: string
    trend?: "up" | "down" | "NULL"
    description: string
    icon?: "dollar" | "users" | "cart" | "activity" | "trending-up" | "trending-down" | "customer"
    variant?: "default" | "success" | "warning" | "danger" | "simple"
    formatType?: "currency" | "number" | "percentage"
    currency?: string
}

const iconMap: Record<string, LucideIcon> = {
    dollar: DollarSign,
    users: Users,
    cart: ShoppingCart,
    activity: Activity,
    "trending-up": TrendingUp,
    "trending-down": TrendingDown,
}

export default function DynamicRevenueCard({
    title,
    amount,
    percentage,
    trend = "up",
    description,
    icon,
    variant = "default",
    formatType = "currency",
    currency = "PKR"
}: RevenueCardProps) {

    // Format the amount based on type
    const formatAmount = (value: string | number): string => {
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value

        switch (formatType) {
            case 'currency':
                return formatCurrency(numValue, currency)
            case 'number':
                // Format to at most 2 decimal places, and remove trailing zeros if it's a whole number
                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }).format(numValue)
            case 'percentage':
                return `${numValue}%`
            default:
                return value.toString()
        }
    }

    return (
        <Card className="bg-white border border-gray-300 rounded-sm w-full py-0 gap-0">
            <CardContent className="px-6 py-5">
                {/* Main amount - very large and prominent */}
                <div className="text-3xl md:text-5xl font-light text-gray-900 mb-3 leading-none">
                    {formatAmount(amount)}
                </div>

                {/* Label below - small and muted */}
                <p className="text-sm text-gray-500 font-normal">{title}</p>
            </CardContent>
        </Card>
    )
}
