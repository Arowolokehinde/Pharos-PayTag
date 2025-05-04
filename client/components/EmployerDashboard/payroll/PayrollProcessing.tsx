// "use client";

// import { FC, useState, useEffect } from "react";
// import {
//     Calendar,
//     CreditCard,
//     Users,
//     CheckCircle,
//     AlertCircle,
//     Clock,
//     Loader2,
//     FileText,
//     CalendarClock,
//     Wallet,
//     RefreshCw,
//     Download,
//     DollarSign
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardFooter
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from "@/components/ui/select";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogClose
// } from "@/components/ui/dialog";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";

// // Import employee interface
// import { Employee } from "../EmployeeTable";

// interface PayrollProcessingProps {
//     employees: Employee[];
//     walletBalance?: number;
//     nextPayrollDate: string;
//     daysToNextPayroll: number;
// }

// const PayrollProcessing: FC<PayrollProcessingProps> = ({
//     employees,
//     walletBalance,
//     nextPayrollDate,
//     daysToNextPayroll
// }) => {
//     // States
//     const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
//     const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
//     const [selectAll, setSelectAll] = useState<boolean>(true);
//     const [isProcessing, setIsProcessing] = useState<boolean>(false);
//     const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
//     const [processingStep, setProcessingStep] = useState<number>(0);
//     const [processComplete, setProcessComplete] = useState<boolean>(false);

//     // Animation variants
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 duration: 0.3
//             }
//         }
//     };

//     // Filter only active employees
//     const activeEmployees = employees.filter(emp => emp.status === "active");

//     // Calculate total payroll amount
//     const calculateTotalPayroll = (): number => {
//         return activeEmployees
//             .filter(emp => selectedEmployees.includes(emp.id))
//             .reduce((total, emp) => {
//                 const salary = parseFloat(emp.salary.replace(/[^0-9.-]+/g, ""));
//                 return total + (isNaN(salary) ? 0 : salary);
//             }, 0);
//     };

//     const totalPayroll = calculateTotalPayroll();

//     // Check if we have sufficient balance
//     const hasSufficientBalance = (walletBalance ?? 0) >= totalPayroll;

//     // Toggle all employees
//     const toggleSelectAll = (value: boolean) => {
//         setSelectAll(value);
//         if (value) {
//             setSelectedEmployees(activeEmployees.map(emp => emp.id));
//         } else {
//             setSelectedEmployees([]);
//         }
//     };

//     // Toggle single employee
//     const toggleEmployee = (id: string) => {
//         if (selectedEmployees.includes(id)) {
//             setSelectedEmployees(prev => prev.filter(empId => empId !== id));
//             if (selectAll) setSelectAll(false);
//         } else {
//             setSelectedEmployees(prev => [...prev, id]);
//             // Check if all employees are selected now
//             if (selectedEmployees.length + 1 === activeEmployees.length) {
//                 setSelectAll(true);
//             }
//         }
//     };

//     // Initialize selected employees
//     useEffect(() => {
//         if (activeEmployees.length > 0 && selectedEmployees.length === 0) {
//             setSelectedEmployees(activeEmployees.map(emp => emp.id));
//         }
//     }, [activeEmployees]);

//     // Update selectAll state when selectedEmployees changes
//     useEffect(() => {
//         if (activeEmployees.length > 0) {
//             setSelectAll(selectedEmployees.length === activeEmployees.length);
//         }
//     }, [selectedEmployees, activeEmployees]);

//     // Process payroll simulation
//     const processPayroll = async () => {
//         setProcessingStep(0);
//         setProcessComplete(false);
//         setIsProcessing(true);
//         setConfirmDialogOpen(false);

//         try {
//             // Step 1: Initializing transaction
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             setProcessingStep(1);

//             // Step 2: Verifying wallet balance
//             await new Promise(resolve => setTimeout(resolve, 1200));
//             setProcessingStep(2);

//             // Step 3: Processing payments
//             await new Promise(resolve => setTimeout(resolve, 2000));
//             setProcessingStep(3);

//             // Step 4: Finalizing records
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             setProcessingStep(4);

//             // Complete!
//             setProcessComplete(true);
//         } catch (error) {
//             console.error("Error processing payroll:", error);
//         } finally {
//             // Keep processing state active to show completion
//             setTimeout(() => {
//                 setIsProcessing(false);
//             }, 2000);
//         }
//     };

//     // Get payroll period label
//     const getPayrollPeriodLabel = (): string => {
//         const date = new Date();

//         if (selectedPeriod === "monthly") {
//             return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
//         } else if (selectedPeriod === "biweekly") {
//             // Calculate the biweekly period
//             const today = date.getDate();
//             if (today <= 15) {
//                 return `${date.toLocaleString('default', { month: 'long' })} 1-15, ${date.getFullYear()}`;
//             } else {
//                 return `${date.toLocaleString('default', { month: 'long' })} 16-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}, ${date.getFullYear()}`;
//             }
//         } else {
//             // Weekly
//             const firstDayOfWeek = new Date(date);
//             const day = date.getDay();
//             const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
//             firstDayOfWeek.setDate(diff);

//             const lastDayOfWeek = new Date(firstDayOfWeek);
//             lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

//             return `${firstDayOfWeek.toLocaleDateString()} - ${lastDayOfWeek.toLocaleDateString()}`;
//         }
//     };

//     return (
//         <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             className="space-y-6"
//         >
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Payroll</h1>
//                     <p className="text-slate-500 dark:text-slate-400">Process payments for your team members</p>
//                 </div>

//                 <Button
//                     onClick={() => setConfirmDialogOpen(true)}
//                     disabled={isProcessing || selectedEmployees.length === 0}
//                     className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
//                 >
//                     <CreditCard className="mr-2 h-4 w-4" /> Run Payroll
//                 </Button>
//             </div>

//             {/* Payroll Summary Card */}
//             <Card className="overflow-hidden border-0 shadow-md">
//                 <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
//                 <CardHeader className="flex flex-row items-start gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                         <DollarSign className="h-5 w-5" />
//                     </div>
//                     <div>
//                         <CardTitle>Payroll Summary</CardTitle>
//                         <CardDescription>Overview of upcoming payroll</CardDescription>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                         <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
//                             <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center mr-3">
//                                 <Calendar className="h-5 w-5" />
//                             </div>
//                             <div>
//                                 <div className="text-sm text-slate-500 dark:text-slate-400">Next Payroll</div>
//                                 <div className="text-lg font-bold text-slate-900 dark:text-white">{nextPayrollDate}</div>
//                                 <div className="text-xs text-amber-600 dark:text-amber-400">In {daysToNextPayroll} days</div>
//                             </div>
//                         </div>

//                         <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
//                             <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center mr-3">
//                                 <Users className="h-5 w-5" />
//                             </div>
//                             <div>
//                                 <div className="text-sm text-slate-500 dark:text-slate-400">Active Employees</div>
//                                 <div className="text-lg font-bold text-slate-900 dark:text-white">
//                                     {selectedEmployees.length} of {activeEmployees.length}
//                                 </div>
//                                 <div className="text-xs text-slate-500 dark:text-slate-400">
//                                     Selected for payroll
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-start">
//                             <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center mr-3">
//                                 <Wallet className="h-5 w-5" />
//                             </div>
//                             <div>
//                                 <div className="text-sm text-slate-500 dark:text-slate-400">Total Amount</div>
//                                 <div className="text-lg font-bold text-slate-900 dark:text-white">
//                                     {totalPayroll.toLocaleString()} RPSC
//                                 </div>
//                                 <div className={cn(
//                                     "text-xs",
//                                     hasSufficientBalance ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
//                                 )}>
//                                     {hasSufficientBalance ? "Sufficient balance" : "Insufficient balance"}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="space-y-4">
//                         <div className="flex flex-col md:flex-row gap-4 md:items-end">
//                             <div className="space-y-2 flex-1">
//                                 <Label htmlFor="payroll-period">Payroll Period</Label>
//                                 <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//                                     <SelectTrigger id="payroll-period" className="border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all">
//                                         <SelectValue placeholder="Select period type" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="monthly">Monthly</SelectItem>
//                                         <SelectItem value="biweekly">Bi-Weekly</SelectItem>
//                                         <SelectItem value="weekly">Weekly</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2 flex-1">
//                                 <Label htmlFor="period-label">Period</Label>
//                                 <div id="period-label" className="border border-slate-200 dark:border-slate-700 rounded-md h-10 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800">
//                                     {getPayrollPeriodLabel()}
//                                 </div>
//                             </div>

//                             <div className="flex-1 md:flex-none">
//                                 <Button variant="outline" className="w-full md:w-auto border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
//                                     <CalendarClock className="mr-2 h-4 w-4" /> Schedule
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
//                             <div className="space-y-0.5">
//                                 <Label htmlFor="select-all" className="font-medium">Select All Employees</Label>
//                                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                                     Choose which employees to include in this payroll run
//                                 </p>
//                             </div>
//                             <Switch
//                                 id="select-all"
//                                 checked={selectAll}
//                                 onCheckedChange={toggleSelectAll}
//                                 className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500"
//                             />
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Employee List for Payroll */}
//             <Card className="overflow-hidden border-0 shadow-md">
//                 <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
//                 <CardHeader className="flex flex-row items-start gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                         <Users className="h-5 w-5" />
//                     </div>
//                     <div>
//                         <CardTitle>Employees</CardTitle>
//                         <CardDescription>Team members to be paid in this cycle</CardDescription>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="bg-white dark:bg-slate-900">
//                     <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//                         <Table>
//                             <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
//                                 <TableRow>
//                                     <TableHead className="w-12">
//                                         <span className="sr-only">Select</span>
//                                     </TableHead>
//                                     <TableHead>Employee</TableHead>
//                                     <TableHead>PayTag</TableHead>
//                                     <TableHead>Department</TableHead>
//                                     <TableHead className="text-right">Salary (RPSC)</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {activeEmployees.length > 0 ? (
//                                     activeEmployees.map((employee) => {
//                                         const isSelected = selectedEmployees.includes(employee.id);
//                                         return (
//                                             <TableRow key={employee.id} className={cn(
//                                                 "bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors",
//                                                 !isSelected ? "opacity-50" : ""
//                                             )}>
//                                                 <TableCell>
//                                                     <div className="flex items-center">
//                                                         <Switch
//                                                             checked={isSelected}
//                                                             onCheckedChange={() => toggleEmployee(employee.id)}
//                                                             aria-label={`Select ${employee.name}`}
//                                                             className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500"
//                                                         />
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <div className="flex items-center gap-2">
//                                                         <Avatar className="h-8 w-8">
//                                                             {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
//                                                             <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
//                                                                 {employee.name.charAt(0)}
//                                                             </AvatarFallback>
//                                                         </Avatar>
//                                                         <div className="font-medium">{employee.name}</div>
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
//                                                         @{employee.payTag}
//                                                     </span>
//                                                 </TableCell>
//                                                 <TableCell>{employee.department}</TableCell>
//                                                 <TableCell className="text-right font-medium">{employee.salary}</TableCell>
//                                             </TableRow>
//                                         );
//                                     })
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={5} className="h-24 text-center bg-white dark:bg-slate-900">
//                                             No active employees found.
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </CardContent>
//                 <CardFooter className="border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
//                     <div className="text-sm text-slate-500 dark:text-slate-400">
//                         {selectedEmployees.length} of {activeEmployees.length} employees selected for payroll
//                     </div>

//                     <Button
//                         onClick={() => setConfirmDialogOpen(true)}
//                         disabled={isProcessing || selectedEmployees.length === 0}
//                         className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
//                     >
//                         <CreditCard className="mr-2 h-4 w-4" /> Process Payroll
//                     </Button>
//                 </CardFooter>
//             </Card>

//             {/* Previous Payrolls Accordion */}
//             <Accordion type="single" collapsible defaultValue="previous" className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
//                 <AccordionItem value="previous" className="border-0">
//                     <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
//                     <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
//                         <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                                 <FileText className="h-4 w-4" />
//                             </div>
//                             <span>Previous Payroll Runs</span>
//                         </div>
//                     </AccordionTrigger>
//                     <AccordionContent className="px-4 pb-4 pt-0">
//                         <div className="space-y-4">
//                             {/* Previous payroll records */}
//                             <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
//                                 <Table>
//                                     <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
//                                         <TableRow>
//                                             <TableHead>Period</TableHead>
//                                             <TableHead>Employees</TableHead>
//                                             <TableHead>Total Amount</TableHead>
//                                             <TableHead>Date Processed</TableHead>
//                                             <TableHead className="text-right">Action</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
//                                             <TableCell className="font-medium">April 2025</TableCell>
//                                             <TableCell>23</TableCell>
//                                             <TableCell>23,400 RPSC</TableCell>
//                                             <TableCell>Apr 30, 2025</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                                 >
//                                                     <FileText className="mr-2 h-4 w-4" />
//                                                     View
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                         <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
//                                             <TableCell className="font-medium">March 2025</TableCell>
//                                             <TableCell>21</TableCell>
//                                             <TableCell>21,100 RPSC</TableCell>
//                                             <TableCell>Mar 30, 2025</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                                 >
//                                                     <FileText className="mr-2 h-4 w-4" />
//                                                     View
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                         <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
//                                             <TableCell className="font-medium">February 2025</TableCell>
//                                             <TableCell>21</TableCell>
//                                             <TableCell>21,100 RPSC</TableCell>
//                                             <TableCell>Feb 28, 2025</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                                 >
//                                                     <FileText className="mr-2 h-4 w-4" />
//                                                     View
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </div>

//                             <div className="flex justify-end">
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                 >
//                                     View All History
//                                 </Button>
//                             </div>
//                         </div>
//                     </AccordionContent>
//                 </AccordionItem>
//             </Accordion>

//             {/* Confirm dialog */}
//             <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
//                 <DialogContent className="sm:max-w-md border-0 shadow-lg relative">
//                     <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
//                         <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
//                     </div>

//                     <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div>

//                     <div className="relative z-10">
//                         <DialogHeader className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                                 <CreditCard className="h-5 w-5" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Confirm Payroll Processing</DialogTitle>
//                                 <DialogDescription>
//                                     You are about to process payroll for {selectedEmployees.length} employees with a total amount of {totalPayroll.toLocaleString()} RPSC.
//                                 </DialogDescription>
//                             </div>
//                         </DialogHeader>

//                         <div className="space-y-4 py-4">
//                             <div className="space-y-2">
//                                 <h4 className="text-sm font-medium">Payroll Summary</h4>
//                                 <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4 space-y-3">
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-slate-500 dark:text-slate-400">Period:</span>
//                                         <span className="font-medium">{getPayrollPeriodLabel()}</span>
//                                     </div>
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-slate-500 dark:text-slate-400">Employees:</span>
//                                         <span className="font-medium">{selectedEmployees.length}</span>
//                                     </div>
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-slate-500 dark:text-slate-400">Total Amount:</span>
//                                         <span className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">{totalPayroll.toLocaleString()} RPSC</span>
//                                     </div>
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-slate-500 dark:text-slate-400">Wallet Balance:</span>
//                                         <span className={cn(
//                                             "font-medium",
//                                             hasSufficientBalance ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
//                                         )}>
//                                             {walletBalance} RPSC
//                                         </span>
//                                     </div>
//                                     <Separator />
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-slate-500 dark:text-slate-400">Remaining Balance:</span>
//                                         <span className="font-medium">
//                                             {walletBalance !== undefined ? (walletBalance - totalPayroll).toLocaleString() : '--'} RPSC
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {!hasSufficientBalance && (
//                                 <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm flex items-start">
//                                     <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
//                                     <div>
//                                         <strong>Insufficient balance.</strong> Please add more RPSC tokens to your wallet before proceeding with payroll.
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <DialogFooter>
//                             <DialogClose asChild>
//                                 <Button variant="outline" className="border-slate-200 dark:border-slate-700">Cancel</Button>
//                             </DialogClose>
//                             <Button
//                                 onClick={processPayroll}
//                                 disabled={!hasSufficientBalance || isProcessing}
//                                 className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
//                             >
//                                 Confirm & Process
//                             </Button>
//                         </DialogFooter>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             {/* Processing dialog */}
//             <Dialog open={isProcessing} onOpenChange={() => { }}>
//                 <DialogContent className="sm:max-w-md border-0 shadow-lg relative">
//                     <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
//                         <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
//                     </div>

//                     <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div>

//                     <div className="relative z-10">
//                         <DialogHeader>
//                             <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
//                                 {processComplete ? "Payroll Processed Successfully" : "Processing Payroll"}
//                             </DialogTitle>
//                             <DialogDescription>
//                                 {processComplete
//                                     ? `Payment has been sent to ${selectedEmployees.length} employees.`
//                                     : "Please wait while we process your payroll run."}
//                             </DialogDescription>
//                         </DialogHeader>

//                         <div className="space-y-6 py-4">
//                             {!processComplete && (
//                                 <Progress
//                                     value={25 * (processingStep + 1)}
//                                     className="h-2 transition-all duration-300 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-teal-500"
//                                 />
//                             )}

//                             <div className="space-y-4">
//                                 <div className="flex items-center">
//                                     {processingStep >= 0 ? (
//                                         <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
//                                             <CheckCircle className="h-5 w-5" />
//                                         </div>
//                                     ) : (
//                                         <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
//                                             <Clock className="h-5 w-5" />
//                                         </div>
//                                     )}
//                                     <div className="ml-3 text-sm font-medium">Initializing transaction</div>
//                                 </div>

//                                 <div className="flex items-center">
//                                     {processingStep >= 1 ? (
//                                         <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
//                                             <CheckCircle className="h-5 w-5" />
//                                         </div>
//                                     ) : processingStep === 0 ? (
//                                         <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
//                                             <Loader2 className="h-5 w-5 animate-spin" />
//                                         </div>
//                                     ) : (
//                                         <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
//                                             <Clock className="h-5 w-5" />
//                                         </div>
//                                     )}
//                                     <div className="ml-3 text-sm font-medium">Verifying wallet balance</div>
//                                 </div>

//                                 <div className="flex items-center">
//                                     {processingStep >= 2 ? (
//                                         <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
//                                             <CheckCircle className="h-5 w-5" />
//                                         </div>
//                                     ) : processingStep === 1 ? (
//                                         <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
//                                             <Loader2 className="h-5 w-5 animate-spin" />
//                                         </div>
//                                     ) : (
//                                         <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
//                                             <Clock className="h-5 w-5" />
//                                         </div>
//                                     )}
//                                     <div className="ml-3 text-sm font-medium">Processing payments</div>
//                                 </div>

//                                 <div className="flex items-center">
//                                     {processingStep >= 3 ? (
//                                         <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
//                                             <CheckCircle className="h-5 w-5" />
//                                         </div>
//                                     ) : processingStep === 2 ? (
//                                         <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
//                                             <Loader2 className="h-5 w-5 animate-spin" />
//                                         </div>
//                                     ) : (
//                                         <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
//                                             <Clock className="h-5 w-5" />
//                                         </div>
//                                     )}
//                                     <div className="ml-3 text-sm font-medium">Finalizing records</div>
//                                 </div>
//                             </div>

//                             {processComplete && (
//                                 <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-center">
//                                     <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3">
//                                         <CheckCircle className="h-6 w-6" />
//                                     </div>
//                                     <h4 className="text-lg font-medium text-green-700 dark:text-green-400 mb-1">Payroll Processed!</h4>
//                                     <p className="text-sm text-green-600 dark:text-green-400 mb-4">
//                                         All payments have been sent successfully.
//                                     </p>
//                                     <div className="flex justify-center space-x-2">
//                                         <Button
//                                             variant="outline"
//                                             size="sm"
//                                             className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                         >
//                                             <Download className="mr-2 h-4 w-4" /> Download Report
//                                         </Button>
//                                         <Button
//                                             variant="outline"
//                                             size="sm"
//                                             className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                         >
//                                             <RefreshCw className="mr-2 h-4 w-4" /> Process Another
//                                         </Button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {processComplete && (
//                             <DialogFooter>
//                                 <Button
//                                     onClick={() => setIsProcessing(false)}
//                                     className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
//                                 >
//                                     Return to Dashboard
//                                 </Button>
//                             </DialogFooter>
//                         )}
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </motion.div>
//     );
// };

// export default PayrollProcessing;

// PayrollProcessing.tsx
"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PayrollProcessingProps } from "./types";
import PayrollHeader from "./PayrollHeader";
import PayrollSummaryCard from "./PayrollSummaryCard";
import EmployeeList from "./EmployeeList";
import PreviousPayrolls from "./PreviousPayrolls";
import ConfirmDialog from "./ConfirmDialog";
import { ProcessingDialog } from "./ProcessingDialog";

const PayrollProcessing: FC<PayrollProcessingProps> = ({
    employees,
    walletBalance,
    nextPayrollDate,
    daysToNextPayroll
}) => {
    // States
    const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [processingStep, setProcessingStep] = useState<number>(0);
    const [processComplete, setProcessComplete] = useState<boolean>(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    // Filter only active employees
    const activeEmployees = employees.filter(emp => emp.status === "active");

    // Calculate total payroll amount
    const calculateTotalPayroll = (): number => {
        return activeEmployees
            .filter(emp => selectedEmployees.includes(emp.id))
            .reduce((total, emp) => {
                const salary = parseFloat(emp.salary.replace(/[^0-9.-]+/g, ""));
                return total + (isNaN(salary) ? 0 : salary);
            }, 0);
    };

    const totalPayroll = calculateTotalPayroll();

    // Check if we have sufficient balance
    const hasSufficientBalance = (walletBalance ?? 0) >= totalPayroll;

    // Toggle all employees
    const toggleSelectAll = (value: boolean) => {
        setSelectAll(value);
        if (value) {
            setSelectedEmployees(activeEmployees.map(emp => emp.id));
        } else {
            setSelectedEmployees([]);
        }
    };

    // Toggle single employee
    const toggleEmployee = (id: string) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(prev => prev.filter(empId => empId !== id));
            if (selectAll) setSelectAll(false);
        } else {
            setSelectedEmployees(prev => [...prev, id]);
            // Check if all employees are selected now
            if (selectedEmployees.length + 1 === activeEmployees.length) {
                setSelectAll(true);
            }
        }
    };

    // Initialize selected employees
    useEffect(() => {
        if (activeEmployees.length > 0 && selectedEmployees.length === 0) {
            setSelectedEmployees(activeEmployees.map(emp => emp.id));
        }
    }, [activeEmployees]);

    // Update selectAll state when selectedEmployees changes
    useEffect(() => {
        if (activeEmployees.length > 0) {
            setSelectAll(selectedEmployees.length === activeEmployees.length);
        }
    }, [selectedEmployees, activeEmployees]);

    // Process payroll simulation
    const processPayroll = async () => {
        setProcessingStep(0);
        setProcessComplete(false);
        setIsProcessing(true);
        setConfirmDialogOpen(false);

        try {
            // Step 1: Initializing transaction
            await new Promise(resolve => setTimeout(resolve, 1500));
            setProcessingStep(1);

            // Step 2: Verifying wallet balance
            await new Promise(resolve => setTimeout(resolve, 1200));
            setProcessingStep(2);

            // Step 3: Processing payments
            await new Promise(resolve => setTimeout(resolve, 2000));
            setProcessingStep(3);

            // Step 4: Finalizing records
            await new Promise(resolve => setTimeout(resolve, 1500));
            setProcessingStep(4);

            // Complete!
            setProcessComplete(true);
        } catch (error) {
            console.error("Error processing payroll:", error);
        } finally {
            // Keep processing state active to show completion
            setTimeout(() => {
                setIsProcessing(false);
            }, 2000);
        }
    };

    // Get payroll period label
    const getPayrollPeriodLabel = (): string => {
        const date = new Date();

        if (selectedPeriod === "monthly") {
            return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        } else if (selectedPeriod === "biweekly") {
            // Calculate the biweekly period
            const today = date.getDate();
            if (today <= 15) {
                return `${date.toLocaleString('default', { month: 'long' })} 1-15, ${date.getFullYear()}`;
            } else {
                return `${date.toLocaleString('default', { month: 'long' })} 16-${new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}, ${date.getFullYear()}`;
            }
        } else {
            // Weekly
            const firstDayOfWeek = new Date(date);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            firstDayOfWeek.setDate(diff);

            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

            return `${firstDayOfWeek.toLocaleDateString()} - ${lastDayOfWeek.toLocaleDateString()}`;
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <PayrollHeader
                setConfirmDialogOpen={setConfirmDialogOpen}
                isProcessing={isProcessing}
                selectedEmployees={selectedEmployees}
            />

            <PayrollSummaryCard
                nextPayrollDate={nextPayrollDate}
                daysToNextPayroll={daysToNextPayroll}
                selectedEmployees={selectedEmployees}
                activeEmployees={activeEmployees}
                totalPayroll={totalPayroll}
                hasSufficientBalance={hasSufficientBalance}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                getPayrollPeriodLabel={getPayrollPeriodLabel}
                selectAll={selectAll}
                toggleSelectAll={toggleSelectAll}
            />

            <EmployeeList
                activeEmployees={activeEmployees}
                selectedEmployees={selectedEmployees}
                toggleEmployee={toggleEmployee}
                isProcessing={isProcessing}
                setConfirmDialogOpen={setConfirmDialogOpen}
            />

            <PreviousPayrolls />

            <ConfirmDialog
                open={confirmDialogOpen}
                setOpen={setConfirmDialogOpen}
                selectedEmployees={selectedEmployees}
                totalPayroll={totalPayroll}
                walletBalance={walletBalance}
                hasSufficientBalance={hasSufficientBalance}
                getPayrollPeriodLabel={getPayrollPeriodLabel}
                processPayroll={processPayroll}
                isProcessing={isProcessing}
            />

            <ProcessingDialog
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                processComplete={processComplete}
                processingStep={processingStep}
                selectedEmployees={selectedEmployees}
            />
        </motion.div>
    );
};

export default PayrollProcessing;