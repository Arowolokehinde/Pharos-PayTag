"use client";

import { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    setActiveTab: (id: string) => void;
    variant?: "underline" | "pills" | "buttons";
}

const TabNavigation: FC<TabsNavigationProps> = ({
    tabs,
    activeTab,
    setActiveTab,
    variant = "underline"
}) => {
    const getTabStyles = (id: string) => {
        const isActive = id === activeTab;

        switch (variant) {
            case "underline":
                return cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200",
                    isActive
                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                );

            case "pills":
                return cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                    isActive
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                );

            case "buttons":
                return cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                        ? "bg-blue-600 text-white dark:bg-blue-700"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                );
        }
    };

    return (
        <div className="flex space-x-1 relative">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={getTabStyles(tab.id)}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <div className="flex items-center">
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        <span>{tab.label}</span>
                    </div>

                    {variant === "underline" && tab.id === activeTab && (
                        <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

interface TabsContentProps {
    children: ReactNode;
    value: string;
    activeTab: string;
}

const TabContent: FC<TabsContentProps> = ({
    children,
    value,
    activeTab
}) => {
    return (
        <AnimatePresence mode="wait">
            {value === activeTab && (
                <motion.div
                    key={value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { TabNavigation, TabContent };