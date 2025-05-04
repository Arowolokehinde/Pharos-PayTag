// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useWeb3 } from "@/hooks/use-web3";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";
// import { EmployeeTable } from "@/components/payroll/employee-table";
// import { PayrollActions } from "@/components/payroll/payroll-actions";
// import { EmployeeForm } from "@/components/payroll/employee-form";

// interface Employee {
//     id: number;
//     wallet: string;
//     salary: string;
//     lastPayoutTime: number;
//     active: boolean;
// }

// export default function PayrollPage() {
//     const { isConnected, isAdmin, contracts, address } = useWeb3();
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [userEmployeeInfo, setUserEmployeeInfo] = useState<Employee | null>(null);
//     const [loading, setLoading] = useState(true);

//     const fetchPayrollData = async () => {
//         if (!isConnected || !contracts.realPayPayroll || !address) return;

//         setLoading(true);

//         try {
//             // If admin, fetch all employees
//             if (isAdmin) {
//                 const employeeCount = await contracts.realPayPayroll.getEmployeeCount();
//                 const fetchedEmployees = [];

//                 for (let i = 0; i < employeeCount; i++) {
//                     const id = i + 1; // Employee IDs are 1-based
//                     const employee = await contracts.realPayPayroll.getEmployeeById(id);

//                     fetchedEmployees.push({
//                         id,
//                         wallet: employee.wallet,
//                         salary: ethers.formatEther(employee.salary),
//                         lastPayoutTime: employee.lastPayoutTime.toNumber(),
//                         active: employee.active,
//                     });
//                 }

//                 setEmployees(fetchedEmployees);
//             }

//             // For any user, check if they're an employee
//             try {
//                 const employeeId = await contracts.realPayPayroll.getEmployeeIdByWallet(address);

//                 if (employeeId.toNumber() > 0) {
//                     const employee = await contracts.realPayPayroll.getEmployeeById(employeeId);

//                     setUserEmployeeInfo({
//                         id: employeeId.toNumber(),
//                         wallet: employee.wallet,
//                         salary: ethers.formatEther(employee.salary),
//                         lastPayoutTime: employee.lastPayoutTime.toNumber(),
//                         active: employee.active,
//                     });
//                 }
//             } catch (error) {
//                 // Not an employee, do nothing
//                 console.log("User is not an employee");
//             }
//         } catch (error) {
//             console.error("Error fetching payroll data:", error);
//             toast.error("Failed to fetch payroll data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {


//         fetchPayrollData();
//     }, [isConnected, isAdmin, contracts.realPayPayroll, address]);

//     if (!isConnected) {
//         return (
//             <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please connect your wallet to access the Payroll management.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="py-6">
//             <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold mb-8">Payroll Management</h1>
//             </motion.div>

//             {isAdmin ? (
//                 <Tabs defaultValue="employees" className="w-full">
//                     <TabsList className="grid grid-cols-3 mb-8">
//                         <TabsTrigger value="employees">Employees</TabsTrigger>
//                         <TabsTrigger value="add">Add Employee</TabsTrigger>
//                         <TabsTrigger value="process">Process Payroll</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="employees">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <EmployeeTable
//                                 employees={employees}
//                                 loading={loading}
//                                 contract={contracts.realPayPayroll}
//                                 onSuccess={() => {
//                                     // Refresh employee data
//                                     fetchPayrollData();
//                                 }}
//                             />
//                         </motion.div>
//                     </TabsContent>

//                     <TabsContent value="add">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <EmployeeForm
//                                 contract={contracts.realPayPayroll}
//                                 onSuccess={() => {
//                                     // Refresh employee data
//                                     fetchPayrollData();
//                                 }}
//                             />
//                         </motion.div>
//                     </TabsContent>

//                     <TabsContent value="process">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <PayrollActions
//                                 contract={contracts.realPayPayroll}
//                                 employees={employees}
//                                 onSuccess={() => {
//                                     // Refresh employee data
//                                     fetchPayrollData();
//                                 }}
//                             />
//                         </motion.div>
//                     </TabsContent>
//                 </Tabs>
//             ) : (
//                 <div>
//                     {userEmployeeInfo ? (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5 }}
//                             className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4">Your Employment Information</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
//                                     <p className="text-sm text-slate-600 dark:text-slate-400">Employee ID</p>
//                                     <p className="text-xl font-semibold">{userEmployeeInfo.id}</p>
//                                 </div>
//                                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
//                                     <p className="text-sm text-slate-600 dark:text-slate-400">Salary</p>
//                                     <p className="text-xl font-semibold">
//                                         {userEmployeeInfo.salary} <span className="text-sm text-slate-500">RSC</span>
//                                     </p>
//                                 </div>
//                                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
//                                     <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
//                                     <p className={`text-xl font-semibold ${userEmployeeInfo.active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
//                                         {userEmployeeInfo.active ? "Active" : "Inactive"}
//                                     </p>
//                                 </div>
//                                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
//                                     <p className="text-sm text-slate-600 dark:text-slate-400">Last Payout</p>
//                                     <p className="text-xl font-semibold">
//                                         {userEmployeeInfo.lastPayoutTime > 0
//                                             ? new Date(userEmployeeInfo.lastPayoutTime * 1000).toLocaleString()
//                                             : "No payouts yet"}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="mt-6">
//                                 <h3 className="text-lg font-medium mb-2">Next Payout</h3>
//                                 {userEmployeeInfo.lastPayoutTime > 0 ? (
//                                     <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">Eligible after</p>
//                                         <p className="text-xl font-semibold">
//                                             {new Date((userEmployeeInfo.lastPayoutTime + 30 * 24 * 60 * 60) * 1000).toLocaleString()}
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <p className="text-slate-600 dark:text-slate-400">
//                                         You'll be eligible for your first payout soon. Check back later.
//                                     </p>
//                                 )}
//                             </div>
//                         </motion.div>
//                     ) : loading ? (
//                         <div className="animate-pulse space-y-4">
//                             <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
//                             <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
//                         </div>
//                     ) : (
//                         <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 text-center">
//                             <h2 className="text-xl font-semibold mb-4">Not an Employee</h2>
//                             <p className="text-slate-600 dark:text-slate-400">
//                                 You are not registered as an employee in the payroll system.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }