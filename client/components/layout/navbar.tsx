"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnect from "@/components/auth/wallet-connect";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Menu,
    X,
    ChevronDown,
    ArrowRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const EnhancedNavbar: FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<string | null>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Set active link based on scroll position
        const updateActiveLink = () => {
            const sections = document.querySelectorAll('section[id]');
            let found = false;

            sections.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionId = section.getAttribute('id');

                if (sectionTop < 100 && sectionTop > -100 && !found && sectionId) {
                    setActiveLink(`#${sectionId}`);
                    found = true;
                }
            });

            if (!found && window.scrollY <= 10) {
                setActiveLink(null);
            }
        };

        window.addEventListener('scroll', updateActiveLink);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('scroll', updateActiveLink);
        };
    }, []);

    // Navbar links
    const navLinks = [
        { title: "Features", href: "#features" },
        { title: "How It Works", href: "#how-it-works" },
        {
            title: "Solutions",
            href: "#solutions",
            subItems: [
                { title: "For Freelancers", href: "/dashboard/users" },
                { title: "For Businesses", href: "/dashboard/employers" },
                { title: "For Remote Teams", href: "#remote-teams" },
            ]
        },
        { title: "Developers", href: "/developers" },
    ];

    // Animation variants
    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1
            }
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: -5,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    // For dropdown hover effect
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
                    : "bg-transparent"
            )}
            initial="hidden"
            animate="visible"
            variants={navVariants}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <motion.div variants={logoVariants}>
                        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
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
                            <div className="overflow-hidden">
                                <motion.span
                                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent inline-block"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    RealPayTag
                                </motion.span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation with underline indicator */}
                    <nav className="hidden md:flex items-center space-x-1 relative">
                        {navLinks.map((link, i) => (
                            link.subItems ? (
                                <div key={i} className="relative">
                                    <DropdownMenu
                                        open={dropdownOpen === i}
                                        onOpenChange={(open) => setDropdownOpen(open ? i : null)}
                                    >
                                        <motion.div
                                            custom={i}
                                            variants={linkVariants}
                                        >
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "inline-flex items-center font-medium h-10 rounded-md text-base transition-colors",
                                                        activeLink?.startsWith(link.href) || dropdownOpen === i
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                                    )}
                                                >
                                                    {link.title}
                                                    <motion.div
                                                        animate={{ rotate: dropdownOpen === i ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    </motion.div>
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </motion.div>
                                        <AnimatePresence>
                                            {dropdownOpen === i && (
                                                <DropdownMenuContent
                                                    align="center"
                                                    className="w-64 p-2 mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-xl shadow-slate-200/20 dark:shadow-black/20"
                                                    forceMount
                                                    asChild
                                                >
                                                    <motion.div
                                                        variants={dropdownVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                    >
                                                        <div className="grid gap-1 p-1">
                                                            {link.subItems.map((subItem, j) => (
                                                                <DropdownMenuItem key={j} asChild className="px-0 py-0 focus:bg-transparent">
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className={cn(
                                                                            "flex items-center px-3 py-2.5 rounded-md cursor-pointer text-sm font-medium w-full transition-colors",
                                                                            activeLink === subItem.href
                                                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                                                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                                                                        )}
                                                                        onClick={() => setDropdownOpen(null)}
                                                                    >
                                                                        <span className="mr-6">{subItem.title}</span>
                                                                        <ArrowRight className={cn(
                                                                            "w-4 h-4 ml-auto opacity-0 transition-opacity",
                                                                            activeLink === subItem.href ? "opacity-100" : "group-hover:opacity-70"
                                                                        )} />
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </DropdownMenuContent>
                                            )}
                                        </AnimatePresence>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={linkVariants}
                                    className="relative"
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "inline-flex items-center px-4 py-2 font-medium rounded-md text-base relative transition-colors",
                                            activeLink === link.href
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                        )}
                                    >
                                        {link.title}
                                        {activeLink === link.href && (
                                            <motion.div
                                                className="absolute -bottom-1 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                                                layoutId="activeNavIndicator"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            )
                        ))}
                    </nav>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-3">
                        <motion.div variants={linkVariants} custom={5}>
                            <ThemeToggle />
                        </motion.div>

                        {/* Wallet Connect Button - Desktop */}
                        <motion.div
                            variants={linkVariants}
                            custom={6}
                            className="hidden md:block"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <WalletConnect />
                        </motion.div>

                        {/* Mobile menu button */}
                        <motion.div
                            variants={linkVariants}
                            custom={7}
                            className="md:hidden"
                        >
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="p-0 border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
                                >
                                    <motion.div
                                        className="flex flex-col h-full"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                            <Link
                                                href="/"
                                                className="flex items-center space-x-2"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">R</span>
                                                </div>
                                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                                    RealPayTag
                                                </span>
                                            </Link>
                                            {/* <SheetTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </SheetTrigger> */}
                                        </div>

                                        <div className="px-4 py-6 flex-1 overflow-auto">
                                            <nav className="flex flex-col space-y-5">
                                                {navLinks.map((link, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 + 0.1 }}
                                                    >
                                                        {link.subItems ? (
                                                            <div className="space-y-3">
                                                                <div className="font-medium text-lg text-slate-800 dark:text-slate-200">{link.title}</div>
                                                                <div className="pl-4 flex flex-col space-y-3 border-l-2 border-slate-200 dark:border-slate-700">
                                                                    {link.subItems.map((subItem, j) => (
                                                                        <Link
                                                                            key={j}
                                                                            href={subItem.href}
                                                                            className={cn(
                                                                                "group flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                                                                                activeLink === subItem.href && "text-blue-600 dark:text-blue-400 font-medium"
                                                                            )}
                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                        >
                                                                            <span>{subItem.title}</span>
                                                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={link.href}
                                                                className={cn(
                                                                    "font-medium text-lg flex items-center justify-between group",
                                                                    activeLink === link.href
                                                                        ? "text-blue-600 dark:text-blue-400"
                                                                        : "text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
                                                                )}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                <span>{link.title}</span>
                                                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                            </Link>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </nav>
                                        </div>

                                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                                            {/* Theme toggle in mobile menu */}
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Theme</span>
                                                <ThemeToggle />
                                            </div>

                                            {/* WalletConnect in mobile menu */}
                                            <WalletConnect className="w-full" />
                                        </div>
                                    </motion.div>
                                </SheetContent>
                            </Sheet>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default EnhancedNavbar;
