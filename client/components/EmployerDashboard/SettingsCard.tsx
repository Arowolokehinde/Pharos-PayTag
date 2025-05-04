"use client";

import { FC, useState } from "react";
import {
    Settings,
    Building,
    User,
    Lock,
    Bell,
    Key,
    Save,
    CheckCircle,
    AlertCircle,
    Smartphone,
    Mail,
    CreditCard,
    Loader2,
    Shield,
    Copy,
    Tag,
    Info,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface EmployerSettingsProps {
    companyName?: string;
    companyPayTag?: string;
}

const EmployerSettings: FC<EmployerSettingsProps> = ({
    companyName = "RealTech Ltd",
    companyPayTag = "realtech"
}) => {
    // Company Settings States
    const [newCompanyName, setNewCompanyName] = useState(companyName);
    const [businessType, setBusinessType] = useState("corporation");
    const [companyEmail, setCompanyEmail] = useState("hr@realtechltd.com");
    const [companyPhone, setCompanyPhone] = useState("+2348012345678");
    const [companyAddress, setCompanyAddress] = useState("123 Innovation Way, Lagos, Nigeria");
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("RC-123456789");
    const [isSavingCompany, setIsSavingCompany] = useState(false);
    const [companyLogoUrl, setCompanyLogoUrl] = useState("");

    // PayTag Settings States
    const [isPayTagEditable, setIsPayTagEditable] = useState(false);
    const [newPayTag, setNewPayTag] = useState(companyPayTag);
    const [isCheckingPayTag, setIsCheckingPayTag] = useState(false);
    const [isPayTagAvailable, setIsPayTagAvailable] = useState<boolean | null>(null);
    const [payTagError, setPayTagError] = useState("");

    // Notification Settings States
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [paymentNotifications, setPaymentNotifications] = useState(true);
    const [systemUpdates, setSystemUpdates] = useState(true);
    const [employeeActivity, setEmployeeActivity] = useState(true);
    const [rwaNotifications, setRwaNotifications] = useState(true);

    // Payment Settings States
    const [defaultCurrency, setDefaultCurrency] = useState("RPSC");
    const [autoPayroll, setAutoPayroll] = useState(true);
    const [payrollDate, setPayrollDate] = useState("28");
    const [paymentMethod, setPaymentMethod] = useState("wallet");

    // Security Settings States
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [requiredSigners, setRequiredSigners] = useState("1");
    const [kycVerified, setKycVerified] = useState(true);

    // Simulating PayTag availability check
    const checkPayTagAvailability = async (tag: string) => {
        if (tag.length < 3) {
            setIsPayTagAvailable(null);
            setPayTagError("");
            return;
        }

        setIsCheckingPayTag(true);
        setPayTagError("");

        // Simulate API check
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock availability check
        const reservedTags = ["admin", "support", "help", "official", "system", "realpay"];
        const isAvailable = !reservedTags.includes(tag.toLowerCase()) && tag.toLowerCase() !== "realtech";

        setIsPayTagAvailable(isAvailable);
        setIsCheckingPayTag(false);

        if (!isAvailable && tag.toLowerCase() !== companyPayTag) {
            setPayTagError("This PayTag is already taken or reserved");
        }
    };

    // Handle PayTag change
    const handlePayTagChange = (value: string) => {
        const formatted = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
        setNewPayTag(formatted);

        if (formatted.length >= 3) {
            checkPayTagAvailability(formatted);
        } else {
            setIsPayTagAvailable(null);
            setPayTagError(formatted.length > 0 ? "PayTag must be at least 3 characters" : "");
        }
    };

    // Handle save company profile
    const handleSaveCompanyProfile = async () => {
        setIsSavingCompany(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSavingCompany(false);
        // Here you would typically handle the success state or error state
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your business profile, payment methods, and notification preferences
                    </p>
                </div>
            </div>

            <Tabs defaultValue="company" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                    <TabsTrigger value="company" className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Company</span>
                    </TabsTrigger>
                    <TabsTrigger value="paytag" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">PayTag</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Payment</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                </TabsList>

                {/* Company Profile Tab */}
                <TabsContent value="company">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Profile</CardTitle>
                            <CardDescription>
                                Manage your business information shown to employees and partners
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-2/3 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name</Label>
                                        <Input
                                            id="companyName"
                                            value={newCompanyName}
                                            onChange={(e) => setNewCompanyName(e.target.value)}
                                            placeholder="Enter your company name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessType">Business Type</Label>
                                        <Select value={businessType} onValueChange={setBusinessType}>
                                            <SelectTrigger id="businessType">
                                                <SelectValue placeholder="Select business type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                                <SelectItem value="partnership">Partnership</SelectItem>
                                                <SelectItem value="corporation">Corporation</SelectItem>
                                                <SelectItem value="llc">Limited Liability Company</SelectItem>
                                                <SelectItem value="ngo">Non-Profit Organization</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Business Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={companyEmail}
                                                onChange={(e) => setCompanyEmail(e.target.value)}
                                                placeholder="business@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Business Phone</Label>
                                            <Input
                                                id="phone"
                                                value={companyPhone}
                                                onChange={(e) => setCompanyPhone(e.target.value)}
                                                placeholder="+1234567890"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Business Address</Label>
                                        <Textarea
                                            id="address"
                                            value={companyAddress}
                                            onChange={(e) => setCompanyAddress(e.target.value)}
                                            placeholder="Enter your business address"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registration">Business Registration Number</Label>
                                        <Input
                                            id="registration"
                                            value={businessRegistrationNumber}
                                            onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                                            placeholder="Enter your registration number"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3">
                                    <div className="space-y-3">
                                        <Label>Company Logo</Label>
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 h-48">
                                            {companyLogoUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={companyLogoUrl}
                                                        alt="Company Logo"
                                                        className="object-contain w-full h-full"
                                                    />
                                                    <button
                                                        className="absolute top-1 right-1 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                                        onClick={() => setCompanyLogoUrl("")}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                        <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Drag & drop or click to upload
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        Recommended: 400x400px, PNG or JPG
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            // This would typically trigger a file input
                                                            const dummyLogo = "https://via.placeholder.com/400x400.png?text=RT";
                                                            setCompanyLogoUrl(dummyLogo);
                                                        }}
                                                    >
                                                        Upload Logo
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button
                                disabled={isSavingCompany}
                                onClick={handleSaveCompanyProfile}
                                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                {isSavingCompany ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* PayTag Settings Tab */}
                <TabsContent value="paytag">
                    <Card>
                        <CardHeader>
                            <CardTitle>PayTag Settings</CardTitle>
                            <CardDescription>
                                Manage your company's unique PayTag identifier used for payment reception
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                                            <Tag className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                            Your Current PayTag
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            @{companyPayTag}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="editPayTag">Edit PayTag</Label>
                                    <Switch
                                        id="editPayTag"
                                        checked={isPayTagEditable}
                                        onCheckedChange={setIsPayTagEditable}
                                    />
                                </div>

                                {isPayTagEditable && (
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-slate-500 dark:text-slate-400">@</span>
                                            </div>
                                            <Input
                                                className="pl-8 border-2 focus:border-blue-500 dark:focus:border-blue-400"
                                                placeholder="yourcompany"
                                                value={newPayTag}
                                                onChange={(e) => handlePayTagChange(e.target.value)}
                                                disabled={isCheckingPayTag}
                                            />
                                        </div>

                                        {/* Status indicator */}
                                        <div className="h-6">
                                            {isCheckingPayTag && (
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Checking availability...
                                                </div>
                                            )}

                                            {!isCheckingPayTag && isPayTagAvailable === true && newPayTag.length >= 3 && (
                                                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    @{newPayTag} is available!
                                                </div>
                                            )}

                                            {!isCheckingPayTag && isPayTagAvailable === false && (
                                                <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-4 w-4 mr-2" />
                                                    {payTagError}
                                                </div>
                                            )}

                                            {!isCheckingPayTag && newPayTag === companyPayTag && (
                                                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                                                    <Info className="h-4 w-4 mr-2" />
                                                    This is your current PayTag
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                            <div className="flex space-x-2">
                                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Important note about changing your PayTag:</p>
                                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                                        <li>Changing your PayTag will update your payment receipt address</li>
                                                        <li>You'll need to inform your clients and employees of the change</li>
                                                        <li>Your transaction history will remain intact</li>
                                                        <li>The change is subject to a 72-hour security cooldown</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div>
                                <h3 className="text-lg font-medium mb-3">PayTag Sharing</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Share your PayTag with employees, clients and partners to receive payments
                                </p>

                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    <div className="flex items-center">
                                        <div className="flex-1 flex items-center space-x-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                                                <Tag className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Payment Link</p>
                                                <p className="font-medium">paytag.io/@{companyPayTag}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center space-x-1"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`paytag.io/@${companyPayTag}`);
                                                // Show toast or feedback
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                            <span>Copy</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            {isPayTagEditable && newPayTag !== companyPayTag && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsPayTagEditable(false);
                                            setNewPayTag(companyPayTag);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={!isPayTagAvailable || newPayTag.length < 3 || newPayTag === companyPayTag}
                                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                        onClick={() => {
                                            // This would typically trigger an API call
                                            alert(`PayTag updated from @${companyPayTag} to @${newPayTag}`);
                                            setIsPayTagEditable(false);
                                        }}
                                    >
                                        Update PayTag
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Notification Settings Tab */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Configure how and when you receive notifications from RealPayTag
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <Label htmlFor="emailNotif" className="flex items-center space-x-2 text-base">
                                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>Email Notifications</span>
                                    </Label>
                                    <Switch
                                        id="emailNotif"
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>

                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <Label htmlFor="smsNotif" className="flex items-center space-x-2 text-base">
                                        <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>SMS Notifications</span>
                                    </Label>
                                    <Switch
                                        id="smsNotif"
                                        checked={smsNotifications}
                                        onCheckedChange={setSmsNotifications}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Notification Types</h3>

                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div>
                                            <Label htmlFor="paymentNotif" className="text-base font-medium">Payment Notifications</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Receive notifications for incoming and outgoing payments
                                            </p>
                                        </div>
                                        <Switch
                                            id="paymentNotif"
                                            checked={paymentNotifications}
                                            onCheckedChange={setPaymentNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div>
                                            <Label htmlFor="systemNotif" className="text-base font-medium">System Updates</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Platform updates, maintenance announcements, and security alerts
                                            </p>
                                        </div>
                                        <Switch
                                            id="systemNotif"
                                            checked={systemUpdates}
                                            onCheckedChange={setSystemUpdates}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div>
                                            <Label htmlFor="employeeNotif" className="text-base font-medium">Employee Activity</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Notifications about employee registrations, updates, and account activity
                                            </p>
                                        </div>
                                        <Switch
                                            id="employeeNotif"
                                            checked={employeeActivity}
                                            onCheckedChange={setEmployeeActivity}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div>
                                            <Label htmlFor="rwaNotif" className="text-base font-medium">RWA Activity</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Notifications for real-world asset registration, valuation updates, and more
                                            </p>
                                        </div>
                                        <Switch
                                            id="rwaNotif"
                                            checked={rwaNotifications}
                                            onCheckedChange={setRwaNotifications}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <Button variant="outline">Reset to Default</Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Preferences
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Payment Settings Tab */}
                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Settings</CardTitle>
                            <CardDescription>
                                Configure payment methods, default currency, and payroll settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Currency & Payments</h3>

                                    <div className="space-y-3">
                                        <Label htmlFor="defaultCurrency">Default Currency</Label>
                                        <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                                            <SelectTrigger id="defaultCurrency">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="RPSC">RPSC (Real Pay Stable Coin)</SelectItem>
                                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                                <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                                                <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
                                                <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="paymentMethod">Default Payment Method</Label>
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger id="paymentMethod">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="wallet">Company Wallet</SelectItem>
                                                <SelectItem value="bank">Bank Transfer</SelectItem>
                                                <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Payroll Settings</h3>

                                    <div className="flex items-center justify-between mb-3">
                                        <Label htmlFor="autoPayroll" className="flex items-center space-x-2">
                                            <span>Automatic Payroll Processing</span>
                                        </Label>
                                        <Switch
                                            id="autoPayroll"
                                            checked={autoPayroll}
                                            onCheckedChange={setAutoPayroll}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="payrollDate">Default Payment Date</Label>
                                        <Select value={payrollDate} onValueChange={setPayrollDate} disabled={!autoPayroll}>
                                            <SelectTrigger id="payrollDate">
                                                <SelectValue placeholder="Select day of month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                                    <SelectItem key={day} value={String(day)}>
                                                        {day}{
                                                            day === 1 ? 'st' :
                                                                day === 2 ? 'nd' :
                                                                    day === 3 ? 'rd' : 'th'
                                                        } of the month
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="last">Last day of the month</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {!autoPayroll && (
                                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                                                Manual payroll processing is enabled. You'll need to initiate payroll manually.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Fee Settings</h3>

                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex-shrink-0 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Current Transaction Fees</h4>
                                            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex justify-between">
                                                    <span>Employer to Employee:</span>
                                                    <span className="font-mono">0.1%</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>External Transfers:</span>
                                                    <span className="font-mono">0.5%</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>RWA Registration:</span>
                                                    <span className="font-mono">1.0%</span>
                                                </li>
                                            </ul>
                                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                                                Note: Fees are subject to change based on network conditions and business volume.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <Button variant="outline">Reset to Default</Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Settings Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Configure security options and manage access control for your company account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div>
                                            <h3 className="font-medium flex items-center">
                                                <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                                Two-Factor Authentication
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                Adds an extra layer of security to your account
                                            </p>
                                        </div>
                                        <Switch
                                            checked={twoFactorEnabled}
                                            onCheckedChange={setTwoFactorEnabled}
                                        />
                                    </div>

                                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <h3 className="font-medium flex items-center">
                                            <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                            Multi-Signature Requirements
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                                            Number of signers required for large transactions
                                        </p>

                                        <Select value={requiredSigners} onValueChange={setRequiredSigners}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select required signers" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 signer (no multi-sig)</SelectItem>
                                                <SelectItem value="2">2 signers</SelectItem>
                                                <SelectItem value="3">3 signers</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <div className="flex items-start space-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${kycVerified
                                                    ? "bg-green-100 dark:bg-green-900"
                                                    : "bg-amber-100 dark:bg-amber-900"
                                                }`}>
                                                {kycVerified
                                                    ? <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    : <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                }
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Business Verification Status</h3>
                                                <p className={`font-medium mt-1 ${kycVerified
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                    {kycVerified ? "Verified" : "Verification Required"}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                    {kycVerified
                                                        ? "Your business has been fully verified. You have access to all platform features."
                                                        : "Please complete business verification to unlock all features of the platform."}
                                                </p>

                                                {!kycVerified && (
                                                    <Button
                                                        className="mt-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                        size="sm"
                                                    >
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Complete Verification
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                        <h3 className="font-medium mb-3">Account Recovery Options</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Recovery Email</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">finance@realtechltd.com</p>
                                                </div>
                                                <Button variant="ghost" size="sm">Change</Button>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Recovery Phone</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">+2348099****78</p>
                                                </div>
                                                <Button variant="ghost" size="sm">Change</Button>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                                                    <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Recovery Keys</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Not configured</p>
                                                </div>
                                                <Button variant="ghost" size="sm">Set Up</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
                                <h3 className="font-medium text-red-700 dark:text-red-400 flex items-center mb-2">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    Danger Zone
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Actions in this section can have significant consequences
                                </p>

                                <div className="space-y-3">
                                    <Button variant="outline" className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-start">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Freeze Company Account
                                    </Button>

                                    <Button variant="outline" className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-start">
                                        <User className="mr-2 h-4 w-4" />
                                        Revoke All User Access
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <Button variant="outline">Discard Changes</Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Security Settings
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EmployerSettings;