"use client";

import { FC } from "react";
import {

    FileText,

} from "lucide-react";
import { Button } from "@/components/ui/button";


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PreviousPayrollsProps } from "./types";




const PreviousPayrolls: FC<PreviousPayrollsProps> = () => {
    return (
        <Accordion type="single" collapsible defaultValue="previous" className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <AccordionItem value="previous" className="border-0">
                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>
                <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span>Previous Payroll Runs</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="space-y-4">
                        {/* Previous payroll records */}
                        <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Employees</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead>Date Processed</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        <TableCell className="font-medium">April 2025</TableCell>
                                        <TableCell>23</TableCell>
                                        <TableCell>23,400 RPSC</TableCell>
                                        <TableCell>Apr 30, 2025</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        <TableCell className="font-medium">March 2025</TableCell>
                                        <TableCell>21</TableCell>
                                        <TableCell>21,100 RPSC</TableCell>
                                        <TableCell>Mar 30, 2025</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        <TableCell className="font-medium">February 2025</TableCell>
                                        <TableCell>21</TableCell>
                                        <TableCell>21,100 RPSC</TableCell>
                                        <TableCell>Feb 28, 2025</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                View All History
                            </Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default PreviousPayrolls;



