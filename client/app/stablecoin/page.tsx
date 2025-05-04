// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { BalanceDisplay } from "@/components/stablecoin/balance-display";
// import { MintForm } from "@/components/stablecoin/mint-form";
// import { ContractControls } from "@/components/stablecoin/contract-controls";
// import { useWeb3 } from "@/hooks/use-web3";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";

// export default function StableCoinPage() {
//     const { isConnected, isAdmin, contracts, address } = useWeb3();
//     const [balance, setBalance] = useState("0");
//     const [totalSupply, setTotalSupply] = useState("0");
//     const [isPaused, setIsPaused] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const fetchStableCoinData = async () => {
//         if (!isConnected || !contracts.realStableCoin || !address) return;

//         setLoading(true);

//         try {
//             const [balanceRes, totalSupplyRes, pausedRes] = await Promise.all([
//                 contracts.realStableCoin.balanceOf(address),
//                 contracts.realStableCoin.totalSupply(),
//                 contracts.realStableCoin.paused(),
//             ]);

//             setBalance(ethers.formatEther(balanceRes));
//             setTotalSupply(ethers.formatEther(totalSupplyRes));
//             setIsPaused(pausedRes);
//         } catch (error) {
//             console.error("Error fetching stablecoin data:", error);
//             toast.error("Failed to fetch stablecoin data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {


//         fetchStableCoinData();
//     }, [isConnected, contracts.realStableCoin, address]);

//     if (!isConnected) {
//         return (
//             <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please connect your wallet to access the StableCoin dashboard.
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
//                 <h1 className="text-3xl font-bold mb-8">StableCoin Dashboard</h1>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.1 }}
//                     className="col-span-1"
//                 >
//                     <BalanceDisplay
//                         balance={balance}
//                         totalSupply={totalSupply}
//                         loading={loading}
//                         isPaused={isPaused}
//                     />
//                 </motion.div>

//                 {isAdmin && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                         className="col-span-1 lg:col-span-2"
//                     >
//                         <Tabs defaultValue="mint" className="w-full">
//                             <TabsList className="grid grid-cols-2 mb-6">
//                                 <TabsTrigger value="mint">Mint Tokens</TabsTrigger>
//                                 <TabsTrigger value="controls">Contract Controls</TabsTrigger>
//                             </TabsList>

//                             <TabsContent value="mint">
//                                 <MintForm
//                                     contract={contracts.realStableCoin}
//                                     isPaused={isPaused}
//                                     onSuccess={() => {
//                                         // Refresh balance and total supply
//                                         fetchStableCoinData();
//                                     }}
//                                 />
//                             </TabsContent>

//                             <TabsContent value="controls">
//                                 <ContractControls
//                                     contract={contracts.realStableCoin}
//                                     isPaused={isPaused}
//                                     onStatusChange={(newStatus) => {
//                                         setIsPaused(newStatus);
//                                     }}
//                                 />
//                             </TabsContent>
//                         </Tabs>
//                     </motion.div>
//                 )}
//             </div>

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//             >
//                 <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
//                 <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
//                     <div className="text-center text-slate-600 dark:text-slate-400 py-8">
//                         <p>No transaction history to display.</p>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }