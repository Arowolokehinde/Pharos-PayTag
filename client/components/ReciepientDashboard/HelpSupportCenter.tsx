"use client";

import { FC, useState } from "react";
import {
    Search,
    MessageSquare,
    FileText,
    LifeBuoy,
    Play,
    BookOpen,
    BarChart,
    ChevronRight,
    HelpCircle,
    Briefcase,
    Send,
    Wallet,
    Tag,
    Smartphone,
    Clock,
    Building,
    Loader2,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface HelpSupportCenterProps {
    userType: "recipient" | "employer";
}

const HelpSupportCenter: FC<HelpSupportCenterProps> = ({
    userType = "recipient"
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
    const [showVideoDialog, setShowVideoDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<{
        id: string;
        title: string;
        description: string;
    } | null>(null);

    // Common FAQs for all users
    const commonFaqs = [
        {
            id: "what-is-paytag",
            question: "What is a PayTag?",
            answer: "A PayTag is a unique username (like @yourname) that serves as an easy-to-remember identifier for your wallet. Instead of sharing a complex wallet address, you can simply share your PayTag to receive payments instantly."
        },
        {
            id: "transaction-fees",
            question: "What are the transaction fees?",
            answer: "RealPayTag charges minimal fees: 0.1% for internal transfers between users, 0.5% for external transfers to other platforms, and 1% for currency conversions. There are no hidden charges or monthly fees."
        },
        {
            id: "transaction-speed",
            question: "How fast are transactions processed?",
            answer: "Internal transfers between RealPayTag users are instant. External transfers typically process within 5-10 minutes depending on network congestion, but may take up to 30 minutes during peak times."
        },
        {
            id: "account-security",
            question: "How is my account secured?",
            answer: "We employ industry-standard security measures including two-factor authentication, biometric verification, and encryption for all sensitive data. We also offer multi-signature functionality for high-value accounts."
        },
        {
            id: "kyc-process",
            question: "Why do I need to verify my identity?",
            answer: "Identity verification helps us maintain a secure platform, prevent fraud, and comply with regulatory requirements. This process, known as KYC (Know Your Customer), is standard for financial services."
        }
    ];

    // Recipient-specific FAQs
    const recipientFaqs = [
        {
            id: "receive-payment",
            question: "How do I receive payment using my PayTag?",
            answer: "Simply share your PayTag (e.g., @username) with anyone who wants to pay you. They can use this tag to send payments directly to your wallet without needing your complex wallet address."
        },
        {
            id: "convert-airtime",
            question: "How does airtime conversion work?",
            answer: "Our airtime conversion feature allows you to convert your RPSC tokens to mobile airtime for major telecom networks. Simply select your network provider, enter the phone number and amount, and the airtime will be credited instantly."
        },
        {
            id: "create-invoice",
            question: "Can I create invoices for my clients?",
            answer: "Yes! You can generate professional invoices directly from your dashboard. Go to Transactions > Create Invoice, fill in the client details and services, and send it via email. The invoice will include your PayTag for easy payment."
        },
        {
            id: "change-paytag",
            question: "Can I change my PayTag?",
            answer: "Yes, you can change your PayTag once every 90 days. Go to Settings > PayTag Management to update it. Note that your old PayTag will be reserved for 30 days to prevent confusion."
        }
    ];

    // Employer-specific FAQs
    const employerFaqs = [
        {
            id: "bulk-payments",
            question: "How do I make bulk payments to multiple employees?",
            answer: "You can make bulk payments through the Payroll section of your dashboard. Simply upload a CSV file with employee details or select employees from your list, set the payment amounts, and process the transaction in one go."
        },
        {
            id: "add-employees",
            question: "How do I add employees to my account?",
            answer: "Navigate to the Employees tab and click 'Add Employee'. You can either add employees individually by entering their name and PayTag, or upload a CSV file for bulk addition."
        },
        {
            id: "schedule-payments",
            question: "Can I schedule recurring payments?",
            answer: "Yes, you can set up recurring payments on daily, weekly, or monthly schedules. Go to Payroll > Schedule Payments, select the employees, enter the amounts, and set your preferred frequency and payment date."
        },
        {
            id: "rwa-collateral",
            question: "How does RWA collateral work?",
            answer: "Real World Assets (RWA) can be registered on our platform as collateral for stablecoin minting. The process involves asset verification, valuation, and tokenization. Once approved, you can mint RPSC tokens up to a certain percentage of your asset value."
        }
    ];

    // Get the appropriate FAQs based on user type
    const getFaqsByUserType = () => {
        if (userType === "recipient") {
            return [...commonFaqs, ...recipientFaqs];
        } else {
            return [...commonFaqs, ...employerFaqs];
        }
    };

    // Filter FAQs based on search query
    const filteredFaqs = searchQuery
        ? getFaqsByUserType().filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : getFaqsByUserType();

    // Tutorial videos
    const tutorialVideos = [
        // Common videos
        {
            id: "getting-started",
            title: "Getting Started with RealPayTag",
            description: "Learn the basics of using the RealPayTag platform in this quick introduction video.",
            category: "basics",
            userType: "all"
        },
        {
            id: "account-security",
            title: "Securing Your Account",
            description: "Important security features and best practices to keep your RealPayTag account safe.",
            category: "security",
            userType: "all"
        },
        {
            id: "sending-money",
            title: "How to Send Money Using PayTags",
            description: "A simple guide to sending money to other users via their PayTag.",
            category: "transactions",
            userType: "all"
        },

        // Recipient-specific videos
        {
            id: "setup-paytag",
            title: "Setting Up Your PayTag",
            description: "How to create and customize your unique PayTag for receiving payments.",
            category: "basics",
            userType: "recipient"
        },
        {
            id: "airtime-conversion",
            title: "Converting RPSC to Airtime",
            description: "Step-by-step guide to converting your tokens into mobile airtime.",
            category: "advanced",
            userType: "recipient"
        },

        // Employer-specific videos
        {
            id: "bulk-payroll",
            title: "Managing Bulk Payroll",
            description: "How to efficiently process payroll for multiple employees at once.",
            category: "payroll",
            userType: "employer"
        },
        {
            id: "rwa-registration",
            title: "Registering Real-World Assets",
            description: "Complete guide to registering and tokenizing your real-world assets on the platform.",
            category: "advanced",
            userType: "employer"
        },
        {
            id: "employee-management",
            title: "Employee Management System",
            description: "Learn how to add, manage, and organize your employee database effectively.",
            category: "employees",
            userType: "employer"
        }
    ];

    // Filter tutorial videos based on user type
    const filteredVideos = tutorialVideos.filter(video =>
        video.userType === "all" || video.userType === userType
    );

    // Handle video selection
    const handleVideoSelect = (video: typeof tutorialVideos[0]) => {
        setSelectedVideo(video);
        setShowVideoDialog(true);
    };

    // Handle support ticket submission
    const handleSubmitTicket = () => {
        setIsSubmittingTicket(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmittingTicket(false);
            // Would typically show success message
            window.alert("Support ticket submitted successfully!");

            // Reset form
            const form = document.getElementById("support-form") as HTMLFormElement;
            if (form) form.reset();
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Help & Support Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Find answers to common questions or reach out to our support team
                    </p>
                </div>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        className="pl-10 pr-4 py-6 text-base"
                        placeholder="Search for help articles, tutorials, and FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick links cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <MessageSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Contact Support
                        </CardTitle>
                        <CardDescription>
                            Get help from our support team
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Need personalized help? Our support team is available 24/7.
                        </p>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Contact Us
                        </Button>
                    </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            FAQ
                        </CardTitle>
                        <CardDescription>
                            Find answers to common questions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Browse our frequently asked questions for quick answers.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                            onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            View FAQs
                        </Button>
                    </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <Play className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Video Tutorials
                        </CardTitle>
                        <CardDescription>
                            Learn with step-by-step guides
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Watch our tutorial videos to get the most out of RealPayTag.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                            onClick={() => document.getElementById("tutorials-section")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            View Tutorials
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-10">
                {/* FAQ Section */}
                <section id="faq-section" className="scroll-mt-24">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                            <HelpCircle className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Frequently Asked Questions
                        </h2>

                        {searchQuery && (
                            <Badge variant="outline" className="text-sm">
                                {filteredFaqs.length} results for "{searchQuery}"
                            </Badge>
                        )}
                    </div>

                    {filteredFaqs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {filteredFaqs.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id}>
                                    <AccordionTrigger className="text-base font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                            <HelpCircle className="h-10 w-10 mx-auto text-slate-400" />
                            <h3 className="mt-4 text-lg font-medium">No FAQs found</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Try adjusting your search or browse all FAQs by clearing the search.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setSearchQuery("")}
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}
                </section>

                {/* Video Tutorials Section */}
                <section id="tutorials-section" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center mb-6">
                        <Play className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Video Tutorials
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVideos.map((video) => (
                            <div
                                key={video.id}
                                className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
                                onClick={() => handleVideoSelect(video)}
                            >
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="h-14 w-14 rounded-full bg-white/80 dark:bg-slate-900/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="h-6 w-6 text-blue-600 dark:text-blue-400 ml-1" />
                                    </div>

                                    <Badge
                                        className="absolute top-2 right-2 bg-slate-800/70 hover:bg-slate-800/70 text-white dark:bg-slate-700/70 dark:hover:bg-slate-700/70"
                                    >
                                        {video.category}
                                    </Badge>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium mb-1">{video.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Video Dialog */}
                    <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedVideo?.title}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedVideo?.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                {/* This would be replaced with a real video player in production */}
                                <div className="text-center p-6">
                                    <Play className="h-16 w-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Video player would be embedded here
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                                        Tutorial ID: {selectedVideo?.id}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                                    <LifeBuoy className="h-4 w-4 mr-2" />
                                    Get Help With This Topic
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>

                {/* User Guides Section */}
                <section className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center mb-6">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        User Guides
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                    {userType === "recipient" ? (
                                        "Recipient User Guide"
                                    ) : (
                                        "Employer User Guide"
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Complete documentation for {userType === "recipient" ? "recipients" : "employers"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {userType === "recipient" ? (
                                        <>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Setting up your PayTag identity</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Receiving payments and checking your wallet</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Sending money to other PayTag users</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Converting RPSC tokens to mobile airtime</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Creating your business profile</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Managing employees and payroll</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Registering real-world assets (RWA)</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                <p className="text-sm">Setting up recurring payments</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <Button variant="outline" className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    View Complete Guide
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Quick Start Guides</CardTitle>
                                <CardDescription>
                                    Step-by-step instructions for common tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                {userType === "recipient" ? (
                                                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {userType === "recipient" ? "Setting Up Your PayTag" : "Creating Your Business Profile"}
                                            </span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>

                                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                {userType === "recipient" ? (
                                                    <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {userType === "recipient" ? "Managing Your Wallet" : "Adding & Managing Employees"}
                                            </span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>

                                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                {userType === "recipient" ? (
                                                    <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <BarChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {userType === "recipient" ? "Sending & Requesting Money" : "Running Payroll"}
                                            </span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>

                                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                {userType === "recipient" ? (
                                                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {userType === "recipient" ? "Airtime Conversion" : "RWA Registration"}
                                            </span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Contact Support Section */}
                <section id="contact-section" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center mb-6">
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Contact Support
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submit a Support Ticket</CardTitle>
                                    <CardDescription>
                                        Get help from our support team
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form id="support-form" className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">
                                                    Your Name
                                                </label>
                                                <Input id="name" placeholder="Enter your name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">
                                                    Email Address
                                                </label>
                                                <Input id="email" type="email" placeholder="Enter your email" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium">
                                                Subject
                                            </label>
                                            <Input id="subject" placeholder="What is your question about?" />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">
                                                Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                placeholder="Describe your issue in detail"
                                                rows={6}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="attachment" className="text-sm font-medium">
                                                Attachment (optional)
                                            </label>
                                            <Input id="attachment" type="file" />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Max file size: 10MB. Supported formats: JPG, PNG, PDF.
                                            </p>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Response time: Usually within 24 hours
                                    </p>
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                        onClick={handleSubmitTicket}
                                        disabled={isSubmittingTicket}
                                    >
                                        {isSubmittingTicket ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Submit Ticket
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Other Ways to Get Help</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                                            <div>
                                                <h3 className="font-medium">Live Chat</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    Chat with our support team in real-time
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 text-blue-600 dark:text-blue-400"
                                                >
                                                    Start Chat
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                                            <div>
                                                <h3 className="font-medium">Schedule a Call</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    Book a call with a support specialist
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 text-blue-600 dark:text-blue-400"
                                                >
                                                    Book Call
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <h3 className="font-medium mb-3">Connect With Us</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="text-sm h-9"
                                            >
                                                Twitter
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-sm h-9"
                                            >
                                                Telegram
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-sm h-9"
                                            >
                                                Discord
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-sm h-9"
                                            >
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpSupportCenter;