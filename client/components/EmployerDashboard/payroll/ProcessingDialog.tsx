import { FC } from "react";
import {
    CheckCircle,
    Clock,
    Loader2,
    Download,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Interface for ProcessingDialog component
interface ProcessingDialogProps {
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
    processComplete: boolean;
    processingStep: number;
    selectedEmployees: string[];
}

export const ProcessingDialog: FC<ProcessingDialogProps> = ({
    isProcessing,
    setIsProcessing,
    processComplete,
    processingStep,
    selectedEmployees
}) => {
    return (
        <Dialog open={isProcessing} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md border-0 shadow-lg relative">
                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                </div>

                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div>

                <div className="relative z-10">
                    <DialogHeader>
                        <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                            {processComplete ? "Payroll Processed Successfully" : "Processing Payroll"}
                        </DialogTitle>
                        <DialogDescription>
                            {processComplete
                                ? `Payment has been sent to ${selectedEmployees.length} employees.`
                                : "Please wait while we process your payroll run."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {!processComplete && (
                            <Progress
                                value={25 * (processingStep + 1)}
                                className="h-2 transition-all duration-300 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-teal-500"
                            />
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center">
                                {processingStep >= 0 ? (
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="ml-3 text-sm font-medium">Initializing transaction</div>
                            </div>

                            <div className="flex items-center">
                                {processingStep >= 1 ? (
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                ) : processingStep === 0 ? (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="ml-3 text-sm font-medium">Verifying wallet balance</div>
                            </div>

                            <div className="flex items-center">
                                {processingStep >= 2 ? (
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                ) : processingStep === 1 ? (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="ml-3 text-sm font-medium">Processing payments</div>
                            </div>

                            <div className="flex items-center">
                                {processingStep >= 3 ? (
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                ) : processingStep === 2 ? (
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="ml-3 text-sm font-medium">Finalizing records</div>
                            </div>
                        </div>

                        {processComplete && (
                            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-center">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-medium text-green-700 dark:text-green-400 mb-1">Payroll Processed!</h4>
                                <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                                    All payments have been sent successfully.
                                </p>
                                <div className="flex justify-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" /> Process Another
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {processComplete && (
                        <DialogFooter>
                            <Button
                                onClick={() => setIsProcessing(false)}
                                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                            >
                                Return to Dashboard
                            </Button>
                        </DialogFooter>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProcessingDialog;