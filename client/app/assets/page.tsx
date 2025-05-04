// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AssetForm } from "@/components/assets/asset-form";
// import { AssetList } from "@/components/assets/asset-list";
// import { AssetCard } from "@/components/assets/asset-card";
// import { useWeb3 } from "@/hooks/use-web3";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";

// interface Asset {
//     id: number;
//     name: string;
//     value: string;
//     owner: string;
//     verified: boolean;
// }

// export default function AssetsPage() {
//     const { isConnected, isAdmin, contracts, address } = useWeb3();
//     const [assets, setAssets] = useState<Asset[]>([]);
//     const [myAssets, setMyAssets] = useState<Asset[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

//     const fetchAssets = async () => {
//         if (!isConnected || !contracts.rwaAssetRegistry || !address) return;

//         setLoading(true);

//         try {
//             // Get total asset count
//             const assetCount = await contracts.rwaAssetRegistry.getAssetCount();

//             // Get all assets if admin, or just the user's assets otherwise
//             const fetchedAssets = [];

//             for (let i = 0; i < assetCount; i++) {
//                 const id = i + 1; // Asset IDs are 1-based
//                 const asset = await contracts.rwaAssetRegistry.getAssetById(id);

//                 fetchedAssets.push({
//                     id,
//                     name: asset.name,
//                     value: ethers.formatEther(asset.value),
//                     owner: asset.owner,
//                     verified: asset.verified,
//                 });
//             }

//             // All assets for admin view
//             setAssets(fetchedAssets);

//             // Filter just the user's assets
//             const userAssets = fetchedAssets.filter(
//                 (asset) => asset.owner.toLowerCase() === address.toLowerCase()
//             );
//             setMyAssets(userAssets);
//         } catch (error) {
//             console.error("Error fetching assets:", error);
//             toast.error("Failed to fetch assets");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {


//         fetchAssets();
//     }, [isConnected, contracts.rwaAssetRegistry, address]);

//     if (!isConnected) {
//         return (
//             <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
//                     <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         Please connect your wallet to access the Asset Registry.
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
//                 <h1 className="text-3xl font-bold mb-8">RWA Asset Registry</h1>
//             </motion.div>

//             <Tabs defaultValue={isAdmin ? "allAssets" : "myAssets"} className="w-full">
//                 <TabsList className="grid grid-cols-3 mb-8">
//                     <TabsTrigger value="register">Register Asset</TabsTrigger>
//                     <TabsTrigger value="myAssets">My Assets</TabsTrigger>
//                     {isAdmin && <TabsTrigger value="allAssets">All Assets</TabsTrigger>}
//                 </TabsList>

//                 <TabsContent value="register">
//                     <motion.div
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <AssetForm
//                             contract={contracts.rwaAssetRegistry}
//                             onSuccess={() => {
//                                 // Refresh assets after registration
//                                 fetchAssets();
//                             }}
//                         />
//                     </motion.div>
//                 </TabsContent>

//                 <TabsContent value="myAssets">
//                     <motion.div
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <AssetList
//                             assets={myAssets}
//                             loading={loading}
//                             onSelect={(id) => setSelectedAssetId(id)}
//                             emptyMessage="You don't have any registered assets yet. Register a new asset in the 'Register Asset' tab."
//                         />
//                     </motion.div>
//                 </TabsContent>

//                 {isAdmin && (
//                     <TabsContent value="allAssets">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <AssetList
//                                 assets={assets}
//                                 loading={loading}
//                                 onSelect={(id) => setSelectedAssetId(id)}
//                                 emptyMessage="No assets have been registered yet."
//                                 isAdmin={true}
//                                 contract={contracts.rwaAssetRegistry}
//                                 onSuccess={() => {
//                                     // Refresh assets after verification
//                                     fetchAssets();
//                                 }}
//                             />
//                         </motion.div>
//                     </TabsContent>
//                 )}
//             </Tabs>

//             {selectedAssetId !== null && (
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="mt-8"
//                 >
//                     <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
//                     <AssetCard
//                         asset={assets.find((a) => a.id === selectedAssetId) || null}
//                         isAdmin={isAdmin}
//                         contract={contracts.rwaAssetRegistry}
//                         onSuccess={() => {
//                             // Refresh assets after verification
//                             fetchAssets();
//                         }}
//                     />
//                 </motion.div>
//             )}
//         </div>
//     );
// }