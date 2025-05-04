// "use client";

// import { FC, useState, useEffect } from "react";
// import { AnimatePresence } from "framer-motion";
// import {
//     BarChart,
//     Users,
//     CreditCard,
//     Building,
//     Calendar,
//     Settings,
//     HelpCircle,
//     ArrowUpRight,
//     Clock
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
// import EmployeeTable, { Employee } from "./EmployeeTable";
// import RWAAssets, { RWAAsset } from "./RWAAssets";
// import { DashboardHeader, DashboardSidebar, TabContent } from "../ReciepientDashboard";
// import { useWallet } from "@/hooks/use-web3";
// import PayrollProcessing from "./payroll/PayrollProcessing";
// import AddEmployeeForm from "./AddEmployeeForm";



// const EmployerDashboard: FC = () => {
//     // States
//     const [activeTab, setActiveTab] = useState<string>("overview");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [isMobile, setIsMobile] = useState(false);
//     const [copiedToClipboard, setCopiedToClipboard] = useState(false);
//     const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [rwaAssets, setRwaAssets] = useState<RWAAsset[]>([]);

//     const { balance: walletBalance } = useWallet();

//     // Dummy data
//     const companyName = "RealTech Ltd";
//     const companyPayTag = "realtech";
//     const nextPayrollDate = "May 28, 2025";
//     const daysToNextPayroll = 3;
//     const payrollProgress = 90;

//     // Recent activities
//     const recentActivities = [
//         {
//             id: "act-001",
//             title: "New Employee Added",
//             description: "Sarah Williams (@sarahw) was added to the system",
//             time: "2 hours ago"
//         },
//         {
//             id: "act-002",
//             title: "Payroll Processed",
//             description: "Monthly payroll for April 2025 was processed successfully",
//             time: "2 days ago"
//         },
//         {
//             id: "act-003",
//             title: "RWA Token Minted",
//             description: "75,000 RPSC tokens were minted from Corporate Bonds",
//             time: "4 days ago"
//         }
//     ];

//     // Check for mobile view on mount and window resize
//     useEffect(() => {
//         const checkMobile = () => {
//             setIsMobile(window.innerWidth < 1024);
//             if (window.innerWidth < 1024) {
//                 setIsSidebarOpen(false);
//             } else {
//                 setIsSidebarOpen(true);
//             }
//         };

//         checkMobile();
//         window.addEventListener("resize", checkMobile);

//         return () => {
//             window.removeEventListener("resize", checkMobile);
//         };
//     }, []);

//     // Load mock data
//     useEffect(() => {
//         // Simulated employee data
//         const mockEmployees: Employee[] = [
//             {
//                 id: "emp-001",
//                 name: "Alex Thompson",
//                 payTag: "alexthompson",
//                 salary: "3,500 RPSC",
//                 department: "Engineering",
//                 status: "active",
//                 lastPaid: "Apr 30, 2025"
//             },
//             {
//                 id: "emp-002",
//                 name: "Maria Rodriguez",
//                 payTag: "mariar",
//                 salary: "2,800 RPSC",
//                 department: "Design",
//                 status: "active",
//                 lastPaid: "Apr 30, 2025"
//             },
//             {
//                 id: "emp-003",
//                 name: "John Doe",
//                 payTag: "johndoe",
//                 salary: "4,200 RPSC",
//                 department: "Marketing",
//                 status: "active",
//                 lastPaid: "Apr 30, 2025"
//             },
//             {
//                 id: "emp-004",
//                 name: "Sarah Williams",
//                 payTag: "sarahw",
//                 salary: "3,900 RPSC",
//                 department: "Product",
//                 status: "pending",
//                 lastPaid: "N/A"
//             }
//         ];

//         // RWA assets
//         const mockAssets: RWAAsset[] = [
//             {
//                 id: "rwa-001",
//                 name: "Office Building A",
//                 type: "real_estate",
//                 value: "500,000 USD",
//                 tokenized: "250,000 RPSC",
//                 status: "active",
//                 date: "Jan 15, 2025"
//             },
//             {
//                 id: "rwa-002",
//                 name: "Treasury Bonds 2025",
//                 type: "bond",
//                 value: "200,000 USD",
//                 tokenized: "150,000 RPSC",
//                 status: "active",
//                 date: "Feb 22, 2025"
//             },
//             {
//                 id: "rwa-003",
//                 name: "Corporate Bonds Q2",
//                 type: "bond",
//                 value: "100,000 USD",
//                 tokenized: "75,000 RPSC",
//                 status: "pending",
//                 date: "May 1, 2025"
//             }
//         ];

//         setEmployees(mockEmployees);
//         setRwaAssets(mockAssets);
//     }, []);

//     // Copy PayTag to clipboard
//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText("@" + text);
//         setCopiedToClipboard(true);

//         setTimeout(() => {
//             setCopiedToClipboard(false);
//         }, 2000);
//     };

//     // Add employee handler
//     const handleAddEmployee = async (employeeData: any) => {
//         // Generate a unique ID for the new employee
//         const newId = `emp-${(employees.length + 1).toString().padStart(3, '0')}`;

//         // Create the new employee object
//         const newEmployee: Employee = {
//             id: newId,
//             name: employeeData.name,
//             payTag: employeeData.payTag,
//             salary: `${employeeData.salary} RPSC`,
//             department: employeeData.department,
//             status: "pending",
//             lastPaid: "N/A"
//         };

//         // Add to employees array
//         setEmployees(prev => [...prev, newEmployee]);

//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     };

//     // Handle edit employee
//     const handleEditEmployee = (id: string) => {
//         console.log(`Edit employee ${id}`);
//         // Implementation would go here
//     };

//     // Handle delete employee
//     const handleDeleteEmployee = (id: string) => {
//         setEmployees(prev => prev.filter(emp => emp.id !== id));
//     };

//     // Handle add RWA asset
//     const handleAddAsset = () => {
//         console.log("Add asset");
//         // Implementation would go here
//     };

//     // Handle view asset details
//     const handleViewAsset = (id: string) => {
//         console.log(`View asset ${id}`);
//         // Implementation would go here
//     };

//     // Navigation items for the sidebar
//     const navItems = [
//         { id: "overview", label: "Dashboard", icon: <BarChart className="w-4 h-4" /> },
//         { id: "employees", label: "Employees", icon: <Users className="w-4 h-4" /> },
//         { id: "payroll", label: "Payroll", icon: <CreditCard className="w-4 h-4" /> },
//         { id: "rwa", label: "RWA Assets", icon: <Building className="w-4 h-4" /> },
//         { id: "schedule", label: "Schedule", icon: <Calendar className="w-4 h-4" /> }
//     ];

//     const accountItems = [
//         { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
//         { id: "help", label: "Help & Support", icon: <HelpCircle className="w-4 h-4" /> }
//     ];

//     // Department list for form
//     const departments = Array.from(new Set(employees.map(emp => emp.department)));

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//             {/* Sidebar */}
//             <DashboardSidebar
//                 isOpen={isSidebarOpen}
//                 setIsOpen={setIsSidebarOpen}
//                 activeTab={activeTab}
//                 setActiveTab={setActiveTab}
//                 payTag={companyPayTag}
//                 walletBalance={walletBalance?.decimals}
//                 isMobile={isMobile}
//                 isEmployer={true}
//             // navItems={navItems}
//             // accountItems={accountItems}
//             />

//             {/* Main Content */}
//             <div className={cn(
//                 "min-h-screen transition-all duration-300",
//                 isSidebarOpen && !isMobile ? "lg:ml-64" : "lg:ml-20"
//             )}>
//                 {/* Header */}
//                 <DashboardHeader
//                     toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//                     isOpen={isSidebarOpen}
//                     payTag={companyPayTag}
//                     copiedToClipboard={copiedToClipboard}
//                     copyToClipboard={copyToClipboard}
//                     isMobile={isMobile}
//                     walletBalance={walletBalance?.decimals}
//                     isEmployer={true}
//                 // companyName={companyName}
//                 />

//                 {/* Main Content Area */}
//                 <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
//                     <AnimatePresence mode="wait">
//                         {activeTab === "overview" && (
//                             <TabContent value="overview" activeTab={activeTab}>
//                                 {/* Page heading */}
//                                 <div className="mb-6">
//                                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Dashboard</h1>
//                                     <p className="text-slate-500 dark:text-slate-400">Welcome to RealPayTag Business Dashboard</p>
//                                 </div>

//                                 {/* Top stats cards */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                                     {/* RPSC Balance */}
//                                     <Card className="bg-white dark:bg-slate-900">
//                                         <CardContent className="p-6">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
//                                                     <CreditCard className="h-5 w-5" />
//                                                 </div>
//                                                 <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Wallet</Badge>
//                                             </div>
//                                             <div className="space-y-1">
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400">Available Balance</p>
//                                                 <p className="text-2xl font-bold text-slate-900 dark:text-white">{walletBalance?.decimals} RPSC</p>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400">≈ ${walletBalance?.decimals} USD</p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     {/* Employees */}
//                                     <Card className="bg-white dark:bg-slate-900">
//                                         <CardContent className="p-6">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
//                                                     <Users className="h-5 w-5" />
//                                                 </div>
//                                                 <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">Team</Badge>
//                                             </div>
//                                             <div className="space-y-1">
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400">Total Employees</p>
//                                                 <p className="text-2xl font-bold text-slate-900 dark:text-white">{employees.length}</p>
//                                                 <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
//                                                     <ArrowUpRight className="h-3 w-3 mr-1" /> +2 this month
//                                                 </p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     {/* Next Payroll */}
//                                     <Card className="bg-white dark:bg-slate-900">
//                                         <CardContent className="p-6">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
//                                                     <Calendar className="h-5 w-5" />
//                                                 </div>
//                                                 <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">Payroll</Badge>
//                                             </div>
//                                             <div className="space-y-1">
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400">Next Payroll</p>
//                                                 <p className="text-2xl font-bold text-slate-900 dark:text-white">{nextPayrollDate}</p>
//                                                 <p className="text-xs text-amber-600 dark:text-amber-400">In {daysToNextPayroll} days</p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     {/* RWA Assets */}
//                                     <Card className="bg-white dark:bg-slate-900">
//                                         <CardContent className="p-6">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
//                                                     <Building className="h-5 w-5" />
//                                                 </div>
//                                                 <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium">Assets</Badge>
//                                             </div>
//                                             <div className="space-y-1">
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400">Tokenized Assets</p>
//                                                 <p className="text-2xl font-bold text-slate-900 dark:text-white">{rwaAssets.length}</p>
//                                                 <p className="text-xs text-teal-600 dark:text-teal-400">475,000 RPSC Total</p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </div>

//                                 {/* Payroll Progress */}
//                                 <Card className="mb-6 bg-white dark:bg-slate-900">
//                                     <CardHeader>
//                                         <div className="flex items-center justify-between">
//                                             <CardTitle>Upcoming Payroll</CardTitle>
//                                             <Button variant="outline" size="sm" onClick={() => setActiveTab("payroll")}>
//                                                 Run Payroll <ArrowUpRight className="ml-2 h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         <CardDescription>Progress towards next payroll cycle</CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="space-y-2">
//                                         <div className="flex items-center justify-between">
//                                             <div className="text-sm font-medium">
//                                                 Monthly Payroll - May 2025
//                                             </div>
//                                             <div className="text-sm font-medium">
//                                                 {payrollProgress}%
//                                             </div>
//                                         </div>
//                                         <Progress value={payrollProgress} className="h-2" />

//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
//                                             <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
//                                                 <div className="text-sm text-slate-500 dark:text-slate-400">Total Amount</div>
//                                                 <div className="text-xl font-bold text-slate-900 dark:text-white">23,400 RPSC</div>
//                                             </div>
//                                             <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
//                                                 <div className="text-sm text-slate-500 dark:text-slate-400">Employees</div>
//                                                 <div className="text-xl font-bold text-slate-900 dark:text-white">{employees.filter(e => e.status === "active").length} active</div>
//                                             </div>
//                                             <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
//                                                 <div className="text-sm text-slate-500 dark:text-slate-400">Processing Date</div>
//                                                 <div className="text-xl font-bold text-slate-900 dark:text-white">{nextPayrollDate}</div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 {/* Two-column layout for Team and Assets */}
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                                     {/* Team Members */}
//                                     <Card>
//                                         <CardHeader className="pb-2">
//                                             <div className="flex items-center justify-between">
//                                                 <CardTitle>Team Members</CardTitle>
//                                                 <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0" onClick={() => setActiveTab("employees")}>
//                                                     View All <ArrowUpRight className="ml-1 h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                             <CardDescription>Your current active employees</CardDescription>
//                                         </CardHeader>
//                                         <CardContent className="px-0">
//                                             <div className="space-y-1">
//                                                 {employees.slice(0, 4).map((employee) => (
//                                                     <div key={employee.id} className="flex items-center justify-between py-3 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
//                                                         <div className="flex items-center gap-3">
//                                                             <Avatar>
//                                                                 <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white">
//                                                                     {employee.name.charAt(0)}
//                                                                 </AvatarFallback>
//                                                             </Avatar>
//                                                             <div>
//                                                                 <p className="font-medium text-slate-900 dark:text-white">{employee.name}</p>
//                                                                 <p className="text-xs text-slate-500 dark:text-slate-400">@{employee.payTag}</p>
//                                                             </div>
//                                                         </div>
//                                                         <div>
//                                                             <Badge className={cn(
//                                                                 "rounded-full",
//                                                                 employee.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
//                                                                     employee.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
//                                                                         "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
//                                                             )}>
//                                                                 {employee.status}
//                                                             </Badge>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     {/* RWA Assets */}
//                                     <Card>
//                                         <CardHeader className="pb-2">
//                                             <div className="flex items-center justify-between">
//                                                 <CardTitle>RWA Assets</CardTitle>
//                                                 <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0" onClick={() => setActiveTab("rwa")}>
//                                                     View All <ArrowUpRight className="ml-1 h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                             <CardDescription>Your tokenized real-world assets</CardDescription>
//                                         </CardHeader>
//                                         <CardContent className="px-0">
//                                             <div className="space-y-1">
//                                                 {rwaAssets.map((asset) => (
//                                                     <div key={asset.id} className="flex items-center justify-between py-3 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
//                                                         <div>
//                                                             <p className="font-medium text-slate-900 dark:text-white">{asset.name}</p>
//                                                             <p className="text-xs text-slate-500 dark:text-slate-400">{asset.type.replace('_', ' ')} • Added {asset.date}</p>
//                                                         </div>
//                                                         <div className="text-right">
//                                                             <p className="font-medium text-slate-900 dark:text-white">{asset.tokenized}</p>
//                                                             <Badge className={cn(
//                                                                 "rounded-full text-xs",
//                                                                 asset.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
//                                                                     asset.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
//                                                                         "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
//                                                             )}>
//                                                                 {asset.status}
//                                                             </Badge>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </div>

//                                 {/* Recent Activities */}
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Recent Activities</CardTitle>
//                                         <CardDescription>Latest actions and updates</CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="space-y-5">
//                                             {recentActivities.map((activity, index) => (
//                                                 <div key={activity.id} className="flex">
//                                                     <div className="mr-4 flex flex-col items-center">
//                                                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
//                                                             <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                                                         </div>
//                                                         {index < recentActivities.length - 1 && (
//                                                             <div className="h-full w-px bg-slate-200 dark:bg-slate-700"></div>
//                                                         )}
//                                                     </div>
//                                                     <div className={index < recentActivities.length - 1 ? "pb-5" : ""}>
//                                                         <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
//                                                         <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
//                                                         <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </TabContent>
//                         )}

//                         {activeTab === "employees" && (
//                             <TabContent value="employees" activeTab={activeTab}>
//                                 <EmployeeTable
//                                     employees={employees}
//                                     onAddEmployee={() => setIsAddEmployeeOpen(true)}
//                                     onEditEmployee={handleEditEmployee}
//                                     onDeleteEmployee={handleDeleteEmployee}
//                                 />
//                             </TabContent>
//                         )}

//                         {activeTab === "payroll" && (
//                             <TabContent value="payroll" activeTab={activeTab}>
//                                 <PayrollProcessing
//                                     employees={employees}
//                                     walletBalance={walletBalance?.decimals}
//                                     nextPayrollDate={nextPayrollDate}
//                                     daysToNextPayroll={daysToNextPayroll}
//                                 />
//                             </TabContent>
//                         )}

//                         {activeTab === "rwa" && (
//                             <TabContent value="rwa" activeTab={activeTab}>
//                                 <RWAAssets
//                                     assets={rwaAssets}
//                                     onAddAsset={handleAddAsset}
//                                     onViewAsset={handleViewAsset}
//                                 />
//                             </TabContent>
//                         )}

//                         {activeTab === "settings" && (
//                             <TabContent value="settings" activeTab={activeTab}>
//                                 <div className="mb-6">
//                                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Settings</h1>
//                                     <p className="text-slate-500 dark:text-slate-400">Manage your RealPayTag business account</p>
//                                 </div>

//                                 {/* Settings content would go here */}
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Account Settings</CardTitle>
//                                         <CardDescription>Configure your business profile and preferences</CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-slate-500 dark:text-slate-400">
//                                             Settings content will be implemented in the next phase.
//                                         </p>
//                                     </CardContent>
//                                 </Card>
//                             </TabContent>
//                         )}
//                     </AnimatePresence>
//                 </main>
//             </div>

//             {/* Add Employee Form Dialog */}
//             <AddEmployeeForm
//                 isOpen={isAddEmployeeOpen}
//                 onClose={() => setIsAddEmployeeOpen(false)}
//                 onAddEmployee={handleAddEmployee}
//                 departments={departments}
//             />
//         </div>
//     );
// };

// export default EmployerDashboard;

"use client";

import { FC, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import EmployeeTable, { Employee } from "./EmployeeTable";
import RWAAssets, { RWAAsset } from "./RWAAssets";
import { DashboardHeader, DashboardSidebar, TabContent } from "../ReciepientDashboard";
import { useWallet } from "@/hooks/use-web3";
import PayrollProcessing from "./payroll/PayrollProcessing";
import AddEmployeeForm from "./AddEmployeeForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DashboardOverview } from "./overview/DashboardOverview";
import EmployerSettings from "./SettingsCard";
import HelpSupportCenter from "../ReciepientDashboard/HelpSupportCenter";
import VerificationKYC from "./VerificationKYC";
import NetworkStatusFeeEstimator from "../ReciepientDashboard/NetworkStatusFeeEstimator";

const EmployerDashboard: FC = () => {
    // States
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [rwaAssets, setRwaAssets] = useState<RWAAsset[]>([]);

    const { balance: walletBalance } = useWallet();

    // Dummy data
    const companyPayTag = "realtech";
    const nextPayrollDate = "May 28, 2025";
    const daysToNextPayroll = 3;
    const payrollProgress = 90;

    // Recent activities
    const recentActivities = [
        {
            id: "act-001",
            title: "New Employee Added",
            description: "Sarah Williams (@sarahw) was added to the system",
            time: "2 hours ago"
        },
        {
            id: "act-002",
            title: "Payroll Processed",
            description: "Monthly payroll for April 2025 was processed successfully",
            time: "2 days ago"
        },
        {
            id: "act-003",
            title: "RWA Token Minted",
            description: "75,000 RPSC tokens were minted from Corporate Bonds",
            time: "4 days ago"
        }
    ];

    // Check for mobile view on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Load mock data
    useEffect(() => {
        // Simulated employee data
        const mockEmployees: Employee[] = [
            {
                id: "emp-001",
                name: "Alex Thompson",
                payTag: "alexthompson",
                salary: "3,500 RPSC",
                department: "Engineering",
                status: "active",
                lastPaid: "Apr 30, 2025"
            },
            {
                id: "emp-002",
                name: "Maria Rodriguez",
                payTag: "mariar",
                salary: "2,800 RPSC",
                department: "Design",
                status: "active",
                lastPaid: "Apr 30, 2025"
            },
            {
                id: "emp-003",
                name: "John Doe",
                payTag: "johndoe",
                salary: "4,200 RPSC",
                department: "Marketing",
                status: "active",
                lastPaid: "Apr 30, 2025"
            },
            {
                id: "emp-004",
                name: "Sarah Williams",
                payTag: "sarahw",
                salary: "3,900 RPSC",
                department: "Product",
                status: "pending",
                lastPaid: "N/A"
            }
        ];

        // RWA assets
        const mockAssets: RWAAsset[] = [
            {
                id: "rwa-001",
                name: "Office Building A",
                type: "real_estate",
                value: "500,000 USD",
                tokenized: "250,000 RPSC",
                status: "active",
                date: "Jan 15, 2025"
            },
            {
                id: "rwa-002",
                name: "Treasury Bonds 2025",
                type: "bond",
                value: "200,000 USD",
                tokenized: "150,000 RPSC",
                status: "active",
                date: "Feb 22, 2025"
            },
            {
                id: "rwa-003",
                name: "Corporate Bonds Q2",
                type: "bond",
                value: "100,000 USD",
                tokenized: "75,000 RPSC",
                status: "pending",
                date: "May 1, 2025"
            }
        ];

        setEmployees(mockEmployees);
        setRwaAssets(mockAssets);
    }, []);

    // Copy PayTag to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText("@" + text);
        setCopiedToClipboard(true);

        setTimeout(() => {
            setCopiedToClipboard(false);
        }, 2000);
    };

    // Add employee handler
    const handleAddEmployee = async (employeeData: any) => {
        // Generate a unique ID for the new employee
        const newId = `emp-${(employees.length + 1).toString().padStart(3, '0')}`;

        // Create the new employee object
        const newEmployee: Employee = {
            id: newId,
            name: employeeData.name,
            payTag: employeeData.payTag,
            salary: `${employeeData.salary} RPSC`,
            department: employeeData.department,
            status: "pending",
            lastPaid: "N/A"
        };

        // Add to employees array
        setEmployees(prev => [...prev, newEmployee]);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    // Handle edit employee
    const handleEditEmployee = (id: string) => {
        console.log(`Edit employee ${id}`);
        // Implementation would go here
    };

    // Handle delete employee
    const handleDeleteEmployee = (id: string) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    // Handle add RWA asset
    const handleAddAsset = () => {
        console.log("Add asset");
        // Implementation would go here
    };

    // Handle view asset details
    const handleViewAsset = (id: string) => {
        console.log(`View asset ${id}`);
        // Implementation would go here
    };

    // Department list for form
    const departments = Array.from(new Set(employees.map(emp => emp.department)));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <DashboardSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                payTag={companyPayTag}
                walletBalance={walletBalance?.decimals}
                isMobile={isMobile}
                isEmployer={true}
            />

            {/* Main Content */}
            <div className={cn(
                "min-h-screen transition-all duration-300",
                isSidebarOpen && !isMobile ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Header */}
                <DashboardHeader
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isOpen={isSidebarOpen}
                    payTag={companyPayTag}
                    copiedToClipboard={copiedToClipboard}
                    copyToClipboard={copyToClipboard}
                    isMobile={isMobile}
                    walletBalance={walletBalance?.decimals}
                    isEmployer={true}
                />

                {/* Main Content Area */}
                <main className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <TabContent value="overview" activeTab={activeTab}>
                                <DashboardOverview
                                    walletBalance={walletBalance?.decimals}
                                    employees={employees}
                                    rwaAssets={rwaAssets}
                                    nextPayrollDate={nextPayrollDate}
                                    daysToNextPayroll={daysToNextPayroll}
                                    payrollProgress={payrollProgress}
                                    recentActivities={recentActivities}
                                    setActiveTab={setActiveTab}
                                />
                            </TabContent>
                        )}

                        {activeTab === "employees" && (
                            <TabContent value="employees" activeTab={activeTab}>
                                <EmployeeTable
                                    employees={employees}
                                    onAddEmployee={() => setIsAddEmployeeOpen(true)}
                                    onEditEmployee={handleEditEmployee}
                                    onDeleteEmployee={handleDeleteEmployee}
                                />
                            </TabContent>
                        )}

                        {activeTab === "payroll" && (
                            <TabContent value="payroll" activeTab={activeTab}>
                                <PayrollProcessing
                                    employees={employees}
                                    walletBalance={walletBalance?.decimals}
                                    nextPayrollDate={nextPayrollDate}
                                    daysToNextPayroll={daysToNextPayroll}
                                />
                            </TabContent>
                        )}

                        {activeTab === "rwa" && (
                            <TabContent value="rwa" activeTab={activeTab}>
                                <RWAAssets
                                    assets={rwaAssets}
                                    onAddAsset={handleAddAsset}
                                    onViewAsset={handleViewAsset}
                                />
                            </TabContent>
                        )}

                        {activeTab === "settings" && (
                            <TabContent value="settings" activeTab={activeTab}>
                                <EmployerSettings />
                            </TabContent>
                        )}

                        {activeTab === "help" && (
                            <TabContent value="help" activeTab={activeTab}>
                                <HelpSupportCenter userType="employer" />
                            </TabContent>
                        )}

                        {activeTab === "verify" && (
                            <TabContent value="verify" activeTab={activeTab}>
                                <VerificationKYC userType="business" />
                            </TabContent>
                        )}
                        {activeTab === "network" && (
                            <TabContent value="network" activeTab={activeTab}>
                                <NetworkStatusFeeEstimator />
                            </TabContent>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Add Employee Form Dialog */}
            <AddEmployeeForm
                isOpen={isAddEmployeeOpen}
                onClose={() => setIsAddEmployeeOpen(false)}
                onAddEmployee={handleAddEmployee}
                departments={departments}
            />
        </div>
    );
};

export default EmployerDashboard;