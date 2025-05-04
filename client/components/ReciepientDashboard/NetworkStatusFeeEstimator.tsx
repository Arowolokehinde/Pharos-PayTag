"use client";

import { FC, useState, useEffect } from "react";
import {
    Activity,
    BarChart,
    Clock,
    CreditCard,
    DollarSign,
    HelpCircle,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Zap,
    Info,
    Loader2,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface NetworkStatusProps {
    className?: string;
}

// Define network status types and gas fee types
type NetworkState = "operational" | "congested" | "degraded";
type FeeSpeed = "slow" | "standard" | "fast" | "instant";

interface NetworkInfo {
    name: string;
    state: NetworkState;
    baseFee: number; // in RPSC
    lastBlock: string;
    avgBlockTime: string; // in seconds
    pendingTxs: number;
}

interface GasFeeOption {
    speed: FeeSpeed;
    label: string;
    time: string;
    fee: number; // in RPSC
    multiplier: number;
}

const NetworkStatusFeeEstimator: FC<NetworkStatusProps> = ({
    className
}) => {
    // State for network information
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
        name: "RealPayTag Network",
        state: "operational",
        baseFee: 0.005,
        lastBlock: "#28,456,789",
        avgBlockTime: "3.2",
        pendingTxs: 156
    });

    // State for fee estimation
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedSpeed, setSelectedSpeed] = useState<FeeSpeed>("standard");
    const [transactionAmount, setTransactionAmount] = useState<number>(100);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Fee options based on current network state
    const feeOptions: GasFeeOption[] = [
        {
            speed: "slow",
            label: "Economy",
            time: networkInfo.state === "congested" ? "20-30 min" : "10-15 min",
            fee: networkInfo.baseFee * 1.0,
            multiplier: 1.0
        },
        {
            speed: "standard",
            label: "Standard",
            time: networkInfo.state === "congested" ? "10-15 min" : "3-5 min",
            fee: networkInfo.baseFee * 1.5,
            multiplier: 1.5
        },
        {
            speed: "fast",
            label: "Fast",
            time: networkInfo.state === "congested" ? "3-5 min" : "1-2 min",
            fee: networkInfo.baseFee * 2.0,
            multiplier: 2.0
        },
        {
            speed: "instant",
            label: "Instant",
            time: networkInfo.state === "congested" ? "1-2 min" : "< 30 sec",
            fee: networkInfo.baseFee * 3.0,
            multiplier: 3.0
        }
    ];

    // Calculate the estimated fee based on selected speed and amount
    const calculateEstimatedFee = () => {
        const selectedOption = feeOptions.find(option => option.speed === selectedSpeed);
        if (!selectedOption) return 0;

        const amount = isCustomAmount && customAmount ? parseFloat(customAmount) : transactionAmount;
        return selectedOption.fee * (amount / 100); // Scale fee based on transaction size
    };

    // Get the total transaction cost (amount + fee)
    const getTotalCost = () => {
        const amount = isCustomAmount && customAmount ? parseFloat(customAmount) : transactionAmount;
        return amount + calculateEstimatedFee();
    };

    // Get network status color and label
    const getNetworkStatusInfo = () => {
        switch (networkInfo.state) {
            case "operational":
                return {
                    color: "text-green-600 dark:text-green-400",
                    bgColor: "bg-green-100 dark:bg-green-900",
                    icon: <CheckCircle className="h-4 w-4" />,
                    label: "Operational"
                };
            case "congested":
                return {
                    color: "text-amber-600 dark:text-amber-400",
                    bgColor: "bg-amber-100 dark:bg-amber-900",
                    icon: <AlertTriangle className="h-4 w-4" />,
                    label: "Congested"
                };
            case "degraded":
                return {
                    color: "text-red-600 dark:text-red-400",
                    bgColor: "bg-red-100 dark:bg-red-900",
                    icon: <AlertTriangle className="h-4 w-4" />,
                    label: "Degraded"
                };
        }
    };

    // Handle refresh button click
    const handleRefresh = () => {
        setIsRefreshing(true);

        // Simulate API call
        setTimeout(() => {
            // Randomly update network state for demonstration
            const states: NetworkState[] = ["operational", "congested", "degraded"];
            const randomState = states[Math.floor(Math.random() * states.length)];

            setNetworkInfo({
                ...networkInfo,
                state: randomState,
                baseFee: 0.003 + Math.random() * 0.008, // Random base fee between 0.003 and 0.011
                lastBlock: `#${28_456_789 + Math.floor(Math.random() * 100)}`,
                avgBlockTime: (2 + Math.random() * 3).toFixed(1),
                pendingTxs: Math.floor(100 + Math.random() * 500)
            });

            setIsRefreshing(false);
        }, 1500);
    };

    // Update fee when network info or selected speed changes
    useEffect(() => {
        // This would typically call an API to get the latest fee data
        // For demo purposes, we're just using the calculated fees
    }, [networkInfo, selectedSpeed]);

    // Handle custom amount change
    const handleCustomAmountChange = (value: string) => {
        // Only allow numbers and decimals
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (value === "" || regex.test(value)) {
            setCustomAmount(value);
        }
    };

    // Network congestion percentage based on pending transactions
    const getCongestionPercentage = () => {
        // Assuming 500+ pending txs is 100% congestion
        return Math.min(100, (networkInfo.pendingTxs / 500) * 100);
    };

    const statusInfo = getNetworkStatusInfo();
    const estimatedFee = calculateEstimatedFee();
    const totalCost = getTotalCost();

    return (
        <div className={cn("", className)}>
            <div className="container mx-auto px-4 py-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Network Status & Fee Estimator
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Check current network status and estimate transaction fees
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Refresh
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Network Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                Network Status
                            </CardTitle>
                            <CardDescription>
                                Current status of the RealPayTag network
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status Overview */}
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full ${statusInfo.bgColor} flex items-center justify-center mr-3`}>
                                        <span className={statusInfo.color}>
                                            {statusInfo.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Current Status
                                        </div>
                                        <div className={`font-semibold ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Base Fee
                                    </div>
                                    <div className="font-mono font-semibold">
                                        {networkInfo.baseFee.toFixed(5)} RPSC
                                    </div>
                                </div>
                            </div>

                            {/* Network Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Last Block
                                    </div>
                                    <div className="font-mono font-medium mt-1">
                                        {networkInfo.lastBlock}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Block Time
                                    </div>
                                    <div className="font-medium mt-1">
                                        {networkInfo.avgBlockTime}s
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 sm:col-span-1 col-span-2">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Pending Txs
                                    </div>
                                    <div className="font-medium mt-1">
                                        {networkInfo.pendingTxs}
                                    </div>
                                </div>
                            </div>

                            {/* Network Congestion */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm font-medium">Network Congestion</div>
                                    <Badge
                                        className={cn(
                                            getCongestionPercentage() < 30
                                                ? "bg-green-500"
                                                : getCongestionPercentage() < 70
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                        )}
                                    >
                                        {Math.round(getCongestionPercentage())}%
                                    </Badge>
                                </div>
                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            getCongestionPercentage() < 30
                                                ? "bg-green-500"
                                                : getCongestionPercentage() < 70
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                        )}
                                        style={{ width: `${getCongestionPercentage()}%` }}
                                    />
                                </div>

                                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
                                    <div className="flex">
                                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-700 dark:text-slate-300">
                                                {networkInfo.state === "operational" && "Network is operating normally. Transactions should be processed quickly."}
                                                {networkInfo.state === "congested" && "Network is experiencing high load. Consider using a higher fee for faster processing."}
                                                {networkInfo.state === "degraded" && "Network is experiencing issues. Transactions may be delayed regardless of fee."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Estimator Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                Fee Estimator
                            </CardTitle>
                            <CardDescription>
                                Estimate transaction fees based on current network conditions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Transaction Amount */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Transaction Amount</label>

                                    <div className="flex items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "h-8 px-2 text-xs",
                                                !isCustomAmount && "bg-slate-100 dark:bg-slate-800"
                                            )}
                                            onClick={() => setIsCustomAmount(false)}
                                        >
                                            Preset
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "h-8 px-2 text-xs",
                                                isCustomAmount && "bg-slate-100 dark:bg-slate-800"
                                            )}
                                            onClick={() => setIsCustomAmount(true)}
                                        >
                                            Custom
                                        </Button>
                                    </div>
                                </div>

                                {isCustomAmount ? (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-slate-500 dark:text-slate-400">RPSC</span>
                                        </div>
                                        <Input
                                            value={customAmount}
                                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                                            className="pl-14"
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <Slider
                                            defaultValue={[100]}
                                            min={1}
                                            max={1000}
                                            step={1}
                                            value={[transactionAmount]}
                                            onValueChange={(value) => setTransactionAmount(value[0])}
                                        />
                                        <div className="flex justify-between">
                                            {[10, 100, 500, 1000].map((amount) => (
                                                <Button
                                                    key={amount}
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "h-8 px-2 text-xs",
                                                        transactionAmount === amount && "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                                    )}
                                                    onClick={() => setTransactionAmount(amount)}
                                                >
                                                    {amount} RPSC
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fee Speed Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Transaction Speed</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {feeOptions.map((option) => (
                                        <button
                                            key={option.speed}
                                            className={cn(
                                                "p-3 rounded-lg border text-left transition-colors",
                                                selectedSpeed === option.speed
                                                    ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30"
                                                    : "border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800"
                                            )}
                                            onClick={() => setSelectedSpeed(option.speed)}
                                        >
                                            <div className="font-medium text-sm">{option.label}</div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    <Clock className="h-3 w-3 inline-block mr-1" />
                                                    {option.time}
                                                </span>
                                                <span className="text-xs font-mono">
                                                    {option.fee.toFixed(3)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fee Estimate */}
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Estimated Fee:</span>
                                    <span className="font-mono font-medium">
                                        {estimatedFee.toFixed(5)} RPSC
                                    </span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Total:</span>
                                    <span className="font-mono">
                                        {totalCost.toFixed(5)} RPSC
                                    </span>
                                </div>
                            </div>

                            {/* Advanced Options */}
                            <Collapsible
                                open={showAdvanced}
                                onOpenChange={setShowAdvanced}
                                className="border rounded-lg border-slate-200 dark:border-slate-700 px-4"
                            >
                                <CollapsibleTrigger className="flex items-center justify-between w-full py-3">
                                    <span className="font-medium">Advanced Options</span>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        showAdvanced && "transform rotate-180"
                                    )} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pb-4 space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Gas Price Multiplier</label>
                                        <div className="flex items-center space-x-2">
                                            <Slider
                                                defaultValue={[1.5]}
                                                min={1.0}
                                                max={3.0}
                                                step={0.1}
                                                disabled
                                            />
                                            <span className="font-mono text-sm min-w-[60px] text-right">
                                                {feeOptions.find(o => o.speed === selectedSpeed)?.multiplier.toFixed(1)}x
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Priority Fee</label>
                                        <Input disabled value="Auto" className="bg-slate-100 dark:bg-slate-800" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Priority fee is automatically calculated based on network conditions
                                        </p>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                        <CardFooter className="flex flex-col border-t border-slate-200 dark:border-slate-800 pt-4">
                            <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white w-full">
                                Apply Fee Settings
                            </Button>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                                These settings will be applied to your next transaction
                            </p>
                        </CardFooter>
                    </Card>
                </div>

                {/* Historical Fee Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Historical Fee Analysis
                        </CardTitle>
                        <CardDescription>
                            View fee trends and historical data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="text-center">
                                <BarChart className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
                                <p className="text-slate-600 dark:text-slate-400">
                                    Historical fee data chart would be displayed here
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                    Chart implementation requires additional data
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    24h Average
                                </div>
                                <div className="font-mono font-medium mt-1">
                                    0.00624 RPSC
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    7d Average
                                </div>
                                <div className="font-mono font-medium mt-1">
                                    0.00581 RPSC
                                </div>
                            </div>
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    30d Average
                                </div>
                                <div className="font-mono font-medium mt-1">
                                    0.00492 RPSC
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Transaction Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Time Your Transactions</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Network fees tend to be lower during off-peak hours. Consider scheduling non-urgent transactions for these times.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 flex-shrink-0">
                                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Batch Transactions</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Combine multiple small transactions into one larger transaction to save on overall fees.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Monitor Network Congestion</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Check network status before making important transactions. High congestion periods can significantly increase fees.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 flex-shrink-0">
                                    <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Choose the Right Speed</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Not all transactions need to be processed instantly. Select a fee speed appropriate for your transaction's urgency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NetworkStatusFeeEstimator;