"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    CreditCard,
    Users,
    Tag,
    Briefcase,
    Phone,
    Lock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "StableCoin",
            href: "/stablecoin",
            icon: <CreditCard className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "Payroll",
            href: "/payroll",
            icon: <Users className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "PayTag",
            href: "/paytag",
            icon: <Tag className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "Assets",
            href: "/assets",
            icon: <Briefcase className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "Airtime",
            href: "/airtime",
            icon: <Phone className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
        {
            title: "Lock",
            href: "/lock",
            icon: <Lock className="h-5 w-5" />,
            showFor: ["admin", "user"],
        },
    ];

    return (
        <AnimatePresence>
            <motion.aside
                initial={{ width: collapsed ? 80 : 240 }}
                animate={{ width: collapsed ? 80 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:block h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto z-40"
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
                            >
                                RealPayTag
                            </motion.div>
                        )}
                    </div>

                    <nav className="flex-1 p-3 space-y-1">
                        {navItems
                            .filter(
                                (item) =>
                                    item.showFor.includes("user")
                                // (isAdmin && item.showFor.includes("admin"))
                            )
                            .map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start ${pathname === item.href
                                            ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            } ${collapsed ? "justify-center" : ""}`}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="ml-3"
                                            >
                                                {item.title}
                                            </motion.span>
                                        )}
                                    </Button>
                                </Link>
                            ))}
                    </nav>

                    <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </motion.aside>
        </AnimatePresence>
    );
}