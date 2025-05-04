"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    Users,
    Tag,
    Briefcase,
    Phone,
    Lock,
    ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
    isAdmin: boolean;
}

export function QuickActions({ isAdmin }: QuickActionsProps) {
    const actions = [
        {
            title: "Mint Tokens",
            description: "Mint new RealStableCoins",
            icon: <CreditCard className="h-5 w-5" />,
            href: "/stablecoin",
            adminOnly: true,
        },
        {
            title: "Manage Employees",
            description: "Add or update employee information",
            icon: <Users className="h-5 w-5" />,
            href: "/payroll",
            adminOnly: true,
        },
        {
            title: "Register Tag",
            description: "Register a new PayTag",
            icon: <Tag className="h-5 w-5" />,
            href: "/paytag",
            adminOnly: false,
        },
        {
            title: "Verify Asset",
            description: "Verify a registered RWA asset",
            icon: <Briefcase className="h-5 w-5" />,
            href: "/assets",
            adminOnly: true,
        },
        {
            title: "Convert Airtime",
            description: "Convert airtime to tokens",
            icon: <Phone className="h-5 w-5" />,
            href: "/airtime",
            adminOnly: false,
        },
        {
            title: "Lock Funds",
            description: "Lock your funds for a period",
            icon: <Lock className="h-5 w-5" />,
            href: "/lock",
            adminOnly: false,
        },
    ];

    const filteredActions = actions.filter(
        (action) => !action.adminOnly || (action.adminOnly && isAdmin)
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action, index) => (
                <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <Link href={action.href}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                            {action.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{action.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}