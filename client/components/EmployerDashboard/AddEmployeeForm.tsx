"use client";

import { FC, useState } from "react";
import {
    User,
    Building,
    Tag,
    DollarSign,
    AlertCircle,
    CheckCircle,
    X,
    Loader2,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Define form field type for type safety
interface FormFields {
    name: string;
    email: string;
    payTag: string;
    department: string;
    salary: string;
    sendInvite: boolean;
}

interface AddEmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAddEmployee: (employee: FormFields) => Promise<void>;
    departments: string[];
}

const AddEmployeeForm: FC<AddEmployeeFormProps> = ({
    isOpen,
    onClose,
    onAddEmployee,
    departments
}) => {
    // Form state
    const [formData, setFormData] = useState<FormFields>({
        name: "",
        email: "",
        payTag: "",
        department: "",
        salary: "",
        sendInvite: true
    });

    // Form status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPayTagChecking, setIsPayTagChecking] = useState(false);
    const [isPayTagAvailable, setIsPayTagAvailable] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    // Handle input changes
    const handleChange = (field: keyof FormFields, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        // Check PayTag availability
        if (field === 'payTag' && typeof value === 'string' && value.length > 2) {
            checkPayTagAvailability(value);
        }
    };

    // Simulate checking PayTag availability
    const checkPayTagAvailability = async (payTag: string) => {
        // Only check valid PayTags
        if (payTag.length < 3) {
            setIsPayTagAvailable(null);
            return;
        }

        setIsPayTagChecking(true);

        // Simulate API call
        setTimeout(() => {
            // Random availability for demo
            const isAvailable = !["johndoe", "mariar", "alexthompson", "sarahw"].includes(payTag);
            setIsPayTagAvailable(isAvailable);
            setIsPayTagChecking(false);

            // Set error if not available
            if (!isAvailable) {
                setErrors(prev => ({
                    ...prev,
                    payTag: "This PayTag is already taken"
                }));
            }
        }, 1000);
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormFields, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.payTag.trim()) {
            newErrors.payTag = "PayTag is required";
        } else if (formData.payTag.length < 3) {
            newErrors.payTag = "PayTag must be at least 3 characters";
        } else if (isPayTagAvailable === false) {
            newErrors.payTag = "This PayTag is already taken";
        }

        if (!formData.department) {
            newErrors.department = "Department is required";
        }

        if (!formData.salary.trim()) {
            newErrors.salary = "Salary is required";
        } else if (isNaN(Number(formData.salary.replace(/,/g, "")))) {
            newErrors.salary = "Please enter a valid amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onAddEmployee(formData);

            // Reset form
            setFormData({
                name: "",
                email: "",
                payTag: "",
                department: "",
                salary: "",
                sendInvite: true
            });

            onClose();
        } catch (error) {
            console.error("Error adding employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle PayTag formatting (no spaces, lowercase)
    const formatPayTag = (value: string): string => {
        return value.toLowerCase().replace(/\s+/g, "");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90%] overflow-y-auto border-0 shadow-lg bg-white dark:bg-slate-900">

                <div className="absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-green-500">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl" />
                </div>


                <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 relative z-10 -mt-6 -mx-6"></div>

                <form onSubmit={handleSubmit} className="relative z-10">
                    <DialogHeader className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Add New Employee</DialogTitle>
                            <DialogDescription>
                                Add a new team member to your RealPayTag HR system
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <Separator className="my-4" />

                    <motion.div
                        className="space-y-6 py-2"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Employee Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700">
                                            <User className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Enter employee name"
                                            className={cn(
                                                "pl-12 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all",
                                                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                                            )}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-xs text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-500 text-sm">@</span>
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="employee@example.com"
                                            className={cn(
                                                "pl-12 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all",
                                                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                                            )}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paytag">
                                        PayTag <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700">
                                            <Tag className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-400">@</div>
                                        <Input
                                            id="paytag"
                                            value={formData.payTag}
                                            onChange={(e) => handleChange('payTag', formatPayTag(e.target.value))}
                                            placeholder="uniquepaytag"
                                            className={cn(
                                                "pl-16 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all",
                                                errors.payTag ? "border-red-500 focus-visible:ring-red-500" : "",
                                                isPayTagAvailable === true ? "border-green-500 focus-visible:ring-green-500" : ""
                                            )}
                                        />
                                        {isPayTagChecking && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                            </div>
                                        )}
                                        {!isPayTagChecking && isPayTagAvailable === true && formData.payTag.length >= 3 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </div>
                                        )}
                                        {!isPayTagChecking && isPayTagAvailable === false && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.payTag ? (
                                        <p className="text-xs text-red-500">{errors.payTag}</p>
                                    ) : (
                                        <p className="text-xs text-slate-500">
                                            This will be used for receiving payments
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">
                                        Department <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700 z-10">
                                            <Building className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <Select
                                            value={formData.department}
                                            onValueChange={(value) => handleChange('department', value)}
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    "pl-12 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all",
                                                    errors.department ? "border-red-500 focus:ring-red-500" : ""
                                                )}
                                            >
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                ))}
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.department && (
                                        <p className="text-xs text-red-500">{errors.department}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <Separator />

                        <motion.div variants={itemVariants} className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Payment Details
                            </h3>

                            <div className="space-y-2">
                                <Label htmlFor="salary">
                                    Monthly Salary (RPSC) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-l-md border-r border-slate-200 dark:border-slate-700">
                                        <DollarSign className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <Input
                                        id="salary"
                                        value={formData.salary}
                                        onChange={(e) => handleChange('salary', e.target.value)}
                                        placeholder="0.00"
                                        className={cn(
                                            "pl-12 pr-16 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all",
                                            errors.salary ? "border-red-500 focus-visible:ring-red-500" : ""
                                        )}
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 rounded-r-md border-l border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">RPSC</span>
                                    </div>
                                </div>
                                {errors.salary ? (
                                    <p className="text-xs text-red-500">{errors.salary}</p>
                                ) : (
                                    <p className="text-xs text-slate-500">
                                        Amount to be paid in RealPayTag StableCoin
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label htmlFor="send-invite" className="font-medium">Send Invitation Email</Label>
                                    <p className="text-xs text-slate-500">
                                        Employee will receive an email to set up their account
                                    </p>
                                </div>
                                <Switch
                                    id="send-invite"
                                    checked={formData.sendInvite}
                                    onCheckedChange={(checked) => handleChange('sendInvite', checked)}
                                    className="data-[state=checked]:bg-gradient-to-r from-blue-600 to-teal-500"
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="border-slate-200 dark:border-slate-700">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Adding..." : "Add Employee"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEmployeeForm;