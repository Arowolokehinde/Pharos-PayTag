"use client";

import { FC } from "react";
import {
    Menu,
    Bell,
    Search,
    Tag,
    Copy,
    CheckCircle,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    toggleSidebar: () => void;
    isOpen: boolean;
    payTag: string;
    copiedToClipboard: boolean;
    copyToClipboard: (text: string) => void;
    isMobile: boolean;
    walletBalance?: number;
    isEmployer?: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({
    toggleSidebar,
    isOpen,
    payTag,
    copiedToClipboard,
    copyToClipboard,
    isMobile,
    walletBalance
}) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className={cn(
            "sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3",
            "transition-all duration-300 ease-in-out",
            !isOpen && !isMobile ? "lg:pl-24" : ""
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Menu Button to toggle sidebar */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>

                    {/* Page Title - on desktop */}
                    <div className="hidden md:flex items-center text-xl font-semibold text-slate-900 dark:text-white">
                        Dashboard
                    </div>

                    {/* Wallet balance - on mobile */}
                    <div className="flex md:hidden items-center space-x-2">
                        <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">{walletBalance} RPSC</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Search Bar - Desktop only */}
                    <div className="hidden md:flex relative rounded-full overflow-hidden w-64">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="rounded-full bg-slate-100 dark:bg-slate-800 border-0 w-full pl-10 h-9"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>

                    {/* PayTag Display */}
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 flex items-center">
                        <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mr-1" />
                        <span className="text-xs font-medium hidden sm:inline">@{payTag}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
                                        onClick={() => copyToClipboard(payTag)}
                                    >
                                        {copiedToClipboard ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{copiedToClipboard ? "Copied!" : "Copy PayTag"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Theme Toggle Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                >
                                    {theme === 'dark' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                        </svg>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle theme</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Notifications Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Notifications</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;