// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { NetworkForm } from "@/components/airtime/network-form";
// import { ConverterForm } from "@/components/airtime/converter-form";
// import { NetworkList } from "@/components/airtime/network-list";
// import { useWeb3 } from "@/hooks/use-web3";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";

// interface Network {
//     id: number;
//     name: string;
//     rate: string;
//     active: boolean;
// }

// export default function AirtimePage() {
//     const { isConnected, isAdmin, contracts } = useWeb3();
//     const [networks, setNetworks] = useState<Network[]>([]);
//     const [loading, setLoading] = useState(true);

//     const fetchNetworks = async () => {
//         if (!isConnected || !contracts.airtimeConverter) return;

//         setLoading(true);

//         try {
//             // Get network count
//             const networkCount = await contracts.airtimeConverter.getNetworkCount();

//             // Fetch all networks
//             const fetchedNetworks = [];

//             for (let i = 0; i < networkCount; i++) {
//                 const id = i + 1; // Network IDs are 1-based
//                 const network = await contracts.airtimeConverter.getNetwork(id);

//                 fetchedNetworks.push({
//                     id,
//                     name: network.name,
//                     rate: ethers.formatUnits(network.rate, 2), // Assuming 2 decimals for rates
//                     active: network.active,
//                 });
//             }

//             setNetworks(fetchedNetworks);
//         } catch (error) {
//             console.error("Error fetching networks:", error);
//             toast.error("Failed to fetch networks");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {


//         fetchNetworks();
//     }, [isConnected, contracts.airtimeConverter]);

//     if (!isConnected) {
//         return (
//             <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please connect your wallet to access the Airtime Converter.
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
//                 <h1 className="text-3xl font-bold mb-8">Airtime Converter</h1>
//             </motion.div>

//             <Tabs defaultValue={isAdmin ? "networks" : "convert"} className="w-full">
//                 <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-8">
//                     <TabsTrigger value="convert">Convert Airtime</TabsTrigger>
//                     <TabsTrigger value="networks">Networks</TabsTrigger>
//                     {isAdmin && <TabsTrigger value="manage">Manage Networks</TabsTrigger>}
//                 </TabsList>

//                 <TabsContent value="convert">
//                     <motion.div
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <ConverterForm
//                             networks={networks.filter(n => n.active)}
//                             loading={loading}
//                             contract={contracts.airtimeConverter}
//                         />
//                     </motion.div>
//                 </TabsContent>

//                 <TabsContent value="networks">
//                     <motion.div
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <NetworkList
//                             networks={networks}
//                             loading={loading}
//                         />
//                     </motion.div>
//                 </TabsContent>

//                 {isAdmin && (
//                     <TabsContent value="manage">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <NetworkForm
//                                 contract={contracts.airtimeConverter}
//                                 onSuccess={() => {
//                                     // Refresh networks after adding/updating
//                                     fetchNetworks();
//                                 }}
//                             />
//                         </motion.div>
//                     </TabsContent>
//                 )}
//             </Tabs>
//         </div>
//     );
// }