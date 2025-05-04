import { FC } from "react";
import { Send, Smartphone, BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionProps {
    setActiveTab: (tab: string) => void;
}

const QuickActions: FC<QuickActionProps> = ({ setActiveTab }) => {
    // Actions for quick access with updated styling to match hero section
    const quickActions = [
        {
            id: "send-payment",
            label: "Send Payment",
            description: "Transfer RPSC to another PayTag",
            icon: <Send className="w-4 h-4" />,
            gradient: "from-blue-600 to-teal-500",
            hoverGradient: "group-hover:from-blue-700 group-hover:to-teal-600",
            iconBg: "bg-white/20",
            targetTab: "send"
        },
        {
            id: "convert-airtime",
            label: "Convert to Airtime",
            description: "Buy airtime with your RPSC balance",
            icon: <Smartphone className="w-4 h-4" />,
            gradient: "from-purple-600 to-blue-500",
            hoverGradient: "group-hover:from-purple-700 group-hover:to-blue-600",
            iconBg: "bg-white/20",
            targetTab: "airtime"
        },
        {
            id: "view-transactions",
            label: "Transaction History",
            description: "View all your past transactions",
            icon: <BarChart3 className="w-4 h-4" />,
            gradient: "from-teal-500 to-green-500",
            hoverGradient: "group-hover:from-teal-600 group-hover:to-green-600",
            iconBg: "bg-white/20",
            targetTab: "transactions"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {quickActions.map((action) => (
                <Card
                    key={action.id}
                    className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => setActiveTab(action.targetTab)}
                >
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-r transition-all duration-300",
                        action.gradient,
                        action.hoverGradient,
                        "opacity-0 group-hover:opacity-100"
                    )} />

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300"
                        style={{
                            backgroundImage: `linear-gradient(to right, var(--${action.gradient.split('-')[1]}-color), var(--${action.gradient.split('-')[3]}-color))`,
                        }}
                    />

                    <CardContent className="p-5 relative">
                        <div className="space-y-3">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                                `bg-gradient-to-br ${action.gradient} group-hover:scale-105`,
                                "text-white shadow-sm"
                            )}>
                                {action.icon}
                            </div>
                            <div className="group-hover:translate-x-1 transition-transform duration-300">
                                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-white transition-colors duration-300">{action.label}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-white/80 transition-colors duration-300">{action.description}</p>
                            </div>
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <ChevronRight className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default QuickActions;