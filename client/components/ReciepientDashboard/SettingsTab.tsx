import { FC } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { UserCircle, Bell, Shield, ArrowRight, Mail, Tag, Lock, CreditCard } from "lucide-react";

interface SettingsTabProps {
    payTag: string;
}

const SettingsTab: FC<SettingsTabProps> = ({ payTag }) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and security settings</p>
            </motion.div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-200"
                    >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-200"
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all duration-200"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal information</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="displayName"
                                            placeholder="Your display name"
                                            className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>PayTag Management</CardTitle>
                                    <CardDescription>Manage your PayTag settings</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Current PayTag</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">@{payTag}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    >
                                        Change
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Control how you receive notifications</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-900 dark:text-white">Payment Notifications</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications for incoming and outgoing payments</p>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-900 dark:text-white">Security Alerts</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for suspicious activities</p>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-900 dark:text-white">Marketing Communications</Label>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about new features and promotions</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                                    Save Preferences
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-teal-500"></div>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Manage your security preferences</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5 flex items-start gap-3">
                                            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <Label className="text-slate-900 dark:text-white">Two-Factor Authentication</Label>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            Enable
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5 flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <Label className="text-slate-900 dark:text-white">Transaction Limits</Label>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Set daily and monthly transaction limits</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            Configure
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-200">
                                        <div className="space-y-0.5 flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <Label className="text-slate-900 dark:text-white">Connected Wallet</Label>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your connected wallet</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default SettingsTab;