// // src/app/lock/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useWeb3 } from "@/hooks/use-web3";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";
// import { Loader2, Lock, UnlockIcon, Clock } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function LockPage() {
//     const { isConnected, contracts, address } = useWeb3();
//     const [unlockTime, setUnlockTime] = useState<number>(0);
//     const [balance, setBalance] = useState<string>("0");
//     const [loading, setLoading] = useState(true);
//     const [withdrawing, setWithdrawing] = useState(false);
//     const [timeLeft, setTimeLeft] = useState<string>("");

//     const fetchLockData = async () => {
//         if (!isConnected || !contracts.lock || !address) return;

//         setLoading(true);

//         try {
//             const [unlockTimeRes, balanceRes] = await Promise.all([
//                 contracts.lock.getUnlockTime(),
//                 contracts.realStableCoin?.balanceOf(contracts.lock.address),
//             ]);

//             setUnlockTime(unlockTimeRes.toNumber());
//             setBalance(ethers.formatEther(balanceRes));
//         } catch (error) {
//             console.error("Error fetching lock data:", error);
//             toast.error("Failed to fetch lock data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {


//         fetchLockData();

//         // Setup timer for countdown
//         const intervalId = setInterval(() => {
//             if (unlockTime > 0) {
//                 const now = Math.floor(Date.now() / 1000);
//                 if (now >= unlockTime) {
//                     setTimeLeft("Funds are unlocked!");
//                 } else {
//                     const secondsLeft = unlockTime - now;
//                     const days = Math.floor(secondsLeft / (24 * 60 * 60));
//                     const hours = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
//                     const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
//                     const seconds = secondsLeft % 60;

//                     setTimeLeft(
//                         `${days}d ${hours}h ${minutes}m ${seconds}s`
//                     );
//                 }
//             }
//         }, 1000);

//         return () => clearInterval(intervalId);
//     }, [isConnected, contracts.lock, contracts.realStableCoin, address, unlockTime]);

//     const handleWithdraw = async () => {
//         if (!contracts.lock) return;

//         setWithdrawing(true);

//         try {
//             const tx = await contracts.lock.withdraw();
//             toast.loading("Withdrawing locked funds...", { id: "withdraw" });

//             await tx.wait();

//             toast.success("Funds withdrawn successfully!", { id: "withdraw" });

//             // Refresh data
//             fetchLockData();
//         } catch (error: any) {
//             console.error("Error withdrawing funds:", error);
//             toast.error(`Failed to withdraw funds: ${error.message || "Unknown error"}`, { id: "withdraw" });
//         } finally {
//             setWithdrawing(false);
//         }
//     };

//     if (!isConnected) {
//         return (
//             <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please connect your wallet to access the Lock Contract.
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
//                 <h1 className="text-3xl font-bold mb-8">Lock Contract</h1>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <motion.div
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.1 }}
//                 >
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="text-lg">Locked Funds</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             {loading ? (
//                                 <div className="space-y-4">
//                                     <Skeleton className="h-10 w-full" />
//                                     <Skeleton className="h-10 w-full" />
//                                 </div>
//                             ) : (
//                                 <div className="space-y-6">
//                                     <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg text-center">
//                                         <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
//                                             Current Balance
//                                         </p>
//                                         <p className="text-3xl font-bold">
//                                             {parseFloat(balance).toFixed(2)} <span className="text-xl text-slate-500">RSC</span>
//                                         </p>
//                                     </div>

//                                     <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
//                                         <div className="flex items-start gap-4">
//                                             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
//                                                 <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                                                     Unlock Time
//                                                 </p>
//                                                 <p className="text-lg font-semibold">
//                                                     {unlockTime > 0
//                                                         ? new Date(unlockTime * 1000).toLocaleString()
//                                                         : "No lock period set"}
//                                                 </p>
//                                                 {unlockTime > 0 && (
//                                                     <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
//                                                         Time left: {timeLeft}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {unlockTime > 0 && (
//                                         <Button
//                                             onClick={handleWithdraw}
//                                             disabled={withdrawing || Math.floor(Date.now() / 1000) < unlockTime}
//                                             className="w-full"
//                                         >
//                                             {withdrawing ? (
//                                                 <>
//                                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                                     Processing...
//                                                 </>
//                                             ) : Math.floor(Date.now() / 1000) < unlockTime ? (
//                                                 <>
//                                                     <Lock className="mr-2 h-4 w-4" />
//                                                     Locked
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <UnlockIcon className="mr-2 h-4 w-4" />
//                                                     Withdraw Funds
//                                                 </>
//                                             )}
//                                         </Button>
//                                     )}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="text-lg">About Lock Contract</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-4">
//                                 <p className="text-slate-700 dark:text-slate-300">
//                                     The Lock Contract allows you to lock your tokens for a specified period. Once locked, the tokens cannot be withdrawn until the unlock time is reached.
//                                 </p>

//                                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
//                                     <h3 className="font-medium mb-2">How it works</h3>
//                                     <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
//                                         <li className="flex items-start gap-2">
//                                             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
//                                                 1
//                                             </span>
//                                             <span>Tokens are transferred to the lock contract</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
//                                                 2
//                                             </span>
//                                             <span>A time lock is set for a specific duration</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
//                                                 3
//                                             </span>
//                                             <span>Tokens cannot be withdrawn until the lock period ends</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
//                                                 4
//                                             </span>
//                                             <span>Once unlocked, tokens can be withdrawn by the owner</span>
//                                         </li>
//                                     </ul>
//                                 </div>

//                                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                                     This contract is useful for ensuring tokens remain locked for a specific period, such as for vesting, savings, or commitment to a project.
//                                 </p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div>page</div>
    )
}

export default page