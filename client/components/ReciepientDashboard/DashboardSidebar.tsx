"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BarChart3,
    Send,
    Smartphone,
    Settings,
    Bell,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    ChartArea,
    Users,
    Currency,
    Building,
    LayoutDashboard,
    Landmark,
    Wallet,
    Verified,
    Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/use-web3";
import { useDisconnect } from "wagmi";

interface DashboardSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    payTag: string;
    walletBalance?: number;
    isMobile: boolean;
    isEmployer?: boolean;

}

const DashboardSidebar: FC<DashboardSidebarProps> = ({
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    payTag,
    walletBalance,
    isMobile,
    isEmployer
}) => {

    const { disconnect } = useDisconnect();




    // Define navigation items
    const userNavItems = [
        { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "send", label: "Send Payment", icon: <Send className="w-4 h-4" /> },
        { id: "airtime", label: "Convert Airtime", icon: <Smartphone className="w-4 h-4" /> },
        { id: "transactions", label: "Transactions", icon: <ChartArea className="w-4 h-4" /> },
        { id: "verify", label: "KYC Verification", icon: <Verified className="w-4 h-4" /> },
        { id: "network", label: "Network", icon: <Network className="w-4 h-4" /> }
    ];

    const employerNavItems = [
        { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "employees", label: "Employees", icon: <Users className="w-4 h-4" /> },
        { id: "payroll", label: "Payroll", icon: <Wallet className="w-4 h-4" /> },
        { id: "rwa", label: "RWA Assets", icon: <Landmark className="w-4 h-4" /> },
        { id: "verify", label: "KYC Verification", icon: <Verified className="w-4 h-4" /> },
        { id: "network", label: "Network", icon: <Network className="w-4 h-4" /> }
    ];

    const accountNavItems = [
        { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
        { id: "help", label: "Help & Support", icon: <Bell className="w-4 h-4" /> },
    ];

    const mainNavItems = isEmployer ? employerNavItems : userNavItems;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transition-all duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
                )}
            >
                <div className="flex flex-col h-full relative">
                    {/* Toggle button (visible only on desktop) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="absolute -right-3 top-16 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {/* Logo & Branding */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="relative w-9 h-9 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/20 transition-shadow">
                                <motion.span
                                    className="text-white font-bold text-lg"
                                    initial={{ y: 0 }}
                                    whileHover={{ y: -30 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    R
                                </motion.span>
                                <motion.span
                                    className="text-white font-bold text-lg absolute"
                                    initial={{ y: 30 }}
                                    whileHover={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    $
                                </motion.span>
                            </div>
                            {isOpen && (
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    RealPayTag
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <ScrollArea className="flex-1 py-4">
                        <nav className="px-2 space-y-1">
                            <div className={cn("px-3 mb-2", !isOpen && "text-center")}>
                                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {isOpen ? "Dashboard" : "Menu"}
                                </h3>
                            </div>

                            {mainNavItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                                        isOpen ? "justify-start" : "justify-center",
                                        activeTab === item.id
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <span className={cn(!isOpen && "mx-auto")}>{item.icon}</span>
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                    {isOpen && activeTab === item.id && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                </button>
                            ))}

                            <Separator className="my-4 opacity-50" />

                            <div className={cn("px-3 mb-2", !isOpen && "text-center")}>
                                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {isOpen ? "Account" : "More"}
                                </h3>
                            </div>

                            {accountNavItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                                        isOpen ? "justify-start" : "justify-center",
                                        activeTab === item.id
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <span className={cn(!isOpen && "mx-auto")}>{item.icon}</span>
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                    {isOpen && activeTab === item.id && (
                                        <motion.div
                                            layoutId="activeAccountNavIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </ScrollArea>

                    {/* User Profile Card */}
                    <div className={cn(
                        "p-4 border-t border-slate-200 dark:border-slate-800",
                        !isOpen && "flex justify-center"
                    )}>
                        {isOpen ? (
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-slate-800">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white font-medium">
                                        {payTag.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        @{payTag}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {walletBalance} RPSC
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>My Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-slate-800 cursor-pointer">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white font-medium">
                                            {payTag.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">@{payTag}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{walletBalance} RPSC</p>
                                    </div>
                                    <DropdownMenuItem className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" />

                                        <span onClick={() => disconnect()}>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardSidebar;