"use client";

import { FC, useState } from "react";
import {
    Building,
    PlusCircle,
    FileText,
    Filter,
    FileDown,
    Search,
    Wallet,
    CreditCard,
    BarChart,
    Banknote,
    Tag,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Define RWA Asset type
export interface RWAAsset {
    id: string;
    name: string;
    type: "real_estate" | "bond" | "commodity" | "other";
    value: string;
    tokenized: string;
    status: "active" | "pending" | "expired";
    date: string;
    description?: string;
    imageUrl?: string;
}

interface RWAAssetsProps {
    assets: RWAAsset[];
    onAddAsset: () => void;
    onViewAsset: (id: string) => void;
}

const RWAAssets: FC<RWAAssetsProps> = ({
    assets,
    onAddAsset,
    onViewAsset
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Asset types and colors for consistent display
    const assetTypeConfig = {
        "real_estate": {
            label: "Real Estate",
            icon: <Building className="h-5 w-5" />,
            color: "from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-600 dark:text-blue-400"
        },
        "bond": {
            label: "Bond",
            icon: <FileText className="h-5 w-5" />,
            color: "from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            textColor: "text-emerald-600 dark:text-emerald-400"
        },
        "commodity": {
            label: "Commodity",
            icon: <Banknote className="h-5 w-5" />,
            color: "from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
            textColor: "text-amber-600 dark:text-amber-400"
        },
        "other": {
            label: "Other Asset",
            icon: <Tag className="h-5 w-5" />,
            color: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-600 dark:text-purple-400"
        }
    };

    // Filter assets based on search and filters
    const filteredAssets = assets.filter(asset => {
        const matchesSearch =
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" || asset.type === typeFilter;
        const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Get total value and token count
    const totalValue = assets.reduce((total, asset) => {
        const valueNumber = parseFloat(asset.value.replace(/[^0-9.-]+/g, ""));
        return total + (isNaN(valueNumber) ? 0 : valueNumber);
    }, 0);

    const totalTokenized = assets.reduce((total, asset) => {
        const tokenNumber = parseFloat(asset.tokenized.replace(/[^0-9.-]+/g, ""));
        return total + (isNaN(tokenNumber) ? 0 : tokenNumber);
    }, 0);

    // Token utilization percentage
    const tokenUtilization = assets.length > 0 ?
        (totalTokenized / totalValue) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">RWA Assets</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your tokenized real-world assets</p>
                </div>

                <Button onClick={onAddAsset} className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Asset
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <Building className="h-5 w-5" />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">Assets</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Assets</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{assets.length}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {filteredAssets.filter(a => a.status === "active").length} active
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">Value</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${totalValue.toLocaleString()}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                All assets combined
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">Tokens</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tokenized</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {totalTokenized.toLocaleString()} RPSC
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Available for payroll
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                <BarChart className="h-5 w-5" />
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">Utilization</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Token Utilization</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {tokenUtilization.toFixed(1)}%
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                Of total asset value
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-md">
                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
                <CardHeader className="pb-4 bg-white dark:bg-slate-950 ">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Asset Registry</CardTitle>
                            <CardDescription>Your tokenized real-world assets</CardDescription>
                        </div>

                        <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                            <TabsList className="dark:bg-slate-900">
                                <TabsTrigger value="grid">Grid View</TabsTrigger>
                                <TabsTrigger value="list">List View</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>

                <CardContent className="bg-white dark:bg-slate-900 pt-3">
                    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search assets..."
                                className="pl-9 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Asset Type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="real_estate">Real Estate</SelectItem>
                                    <SelectItem value="bond">Bonds</SelectItem>
                                    <SelectItem value="commodity">Commodities</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon">
                                <FileDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAssets.length > 0 ? (
                                filteredAssets.map((asset) => (
                                    <Card
                                        key={asset.id}
                                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900"
                                        onClick={() => onViewAsset(asset.id)}
                                    >
                                        <div className={cn(
                                            "h-2 w-full bg-gradient-to-r",
                                            assetTypeConfig[asset.type].color
                                        )} />
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    assetTypeConfig[asset.type].bgColor,
                                                    assetTypeConfig[asset.type].textColor
                                                )}>
                                                    {assetTypeConfig[asset.type].icon}
                                                </div>
                                                <Badge className={cn(
                                                    "rounded-full",
                                                    asset.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                        asset.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                            "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
                                                )}>
                                                    {asset.status}
                                                </Badge>
                                            </div>

                                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{asset.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                                {assetTypeConfig[asset.type].label} • Added {asset.date}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Asset Value:</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">{asset.value}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">Tokenized:</span>
                                                    <span className="font-medium text-slate-900 dark:text-white">{asset.tokenized}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-3 py-10 text-center text-slate-500 dark:text-slate-400">
                                    No assets found matching your filters.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Asset Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Type</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Value</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Tokenized</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date Added</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredAssets.length > 0 ? (
                                        filteredAssets.map((asset) => (
                                            <tr
                                                key={asset.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                                onClick={() => onViewAsset(asset.id)}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                                                            assetTypeConfig[asset.type].bgColor,
                                                            assetTypeConfig[asset.type].textColor
                                                        )}>
                                                            {assetTypeConfig[asset.type].icon}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{asset.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                                                    {assetTypeConfig[asset.type].label}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{asset.value}</td>
                                                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{asset.tokenized}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={cn(
                                                        "rounded-full",
                                                        asset.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                            asset.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                                "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
                                                    )}>
                                                        {asset.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{asset.date}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                onViewAsset(asset.id);
                                                            }}>
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                                                            <DropdownMenuItem>Mint Tokens</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                                Remove Asset
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                                                No assets found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="bg-white dark:bg-slate-900 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-4 rounded-b-lg">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">{filteredAssets.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{assets.length}</span> assets
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled={filteredAssets.length === 0}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled={filteredAssets.length === 0}>
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RWAAssets;