"use client";

import { FC, useState } from "react";
import {
    FileText,
    Upload,
    CheckCircle,
    ChevronRight,
    Loader2,
    X,
    Camera,
    Info,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface VerificationKYCProps {
    userType: "individual" | "business";
    initialStep?: number;
}

// Define the types for verification steps and status
type VerificationStatus = "not_started" | "in_progress" | "completed" | "rejected";
type VerificationStepType = "personal" | "identity" | "address" | "business" | "documents" | "review";

interface VerificationStep {
    id: VerificationStepType;
    title: string;
    description: string;
    status: VerificationStatus;
}

const VerificationKYC: FC<VerificationKYCProps> = ({
    userType = "individual",
    initialStep = 0
}) => {
    // Get default verification steps based on user type
    const getDefaultSteps = (): VerificationStep[] => {
        const baseSteps: VerificationStep[] = [
            {
                id: "personal",
                title: "Personal Information",
                description: "Basic details about yourself",
                status: "not_started"
            },
            {
                id: "identity",
                title: "Identity Verification",
                description: "Verify your identity with official documents",
                status: "not_started"
            },
            {
                id: "address",
                title: "Address Verification",
                description: "Verify your current address",
                status: "not_started"
            }
        ];

        if (userType === "business") {
            return [
                ...baseSteps,
                {
                    id: "business",
                    title: "Business Information",
                    description: "Details about your company",
                    status: "not_started"
                },
                {
                    id: "documents",
                    title: "Business Documents",
                    description: "Registration and operational documents",
                    status: "not_started"
                },
                {
                    id: "review",
                    title: "Final Review",
                    description: "Review and confirm all information",
                    status: "not_started"
                }
            ];
        } else {
            return [
                ...baseSteps,
                {
                    id: "review",
                    title: "Final Review",
                    description: "Review and confirm all information",
                    status: "not_started"
                }
            ];
        }
    };

    // State for verification process
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>(getDefaultSteps());
    const [overallStatus, setOverallStatus] = useState<VerificationStatus>("not_started");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

    // Personal Information States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [nationality, setNationality] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    // Address Information States
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [residenceDuration, setResidenceDuration] = useState("");

    // Business Information States (for business users)
    const [companyName, setCompanyName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [taxId, setTaxId] = useState("");
    const [incorporationDate, setIncorporationDate] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [businessWebsite, setBusinessWebsite] = useState("");

    // Calculate progress percentage
    const calculateProgress = (): number => {
        const completedSteps = verificationSteps.filter(step => step.status === "completed").length;
        return (completedSteps / verificationSteps.length) * 100;
    };

    // Update step status
    const updateStepStatus = (stepIndex: number, status: VerificationStatus) => {
        const updatedSteps = [...verificationSteps];
        updatedSteps[stepIndex].status = status;
        setVerificationSteps(updatedSteps);

        // Update overall status
        if (status === "completed" && stepIndex === verificationSteps.length - 1) {
            setOverallStatus("completed");
        } else if (status === "in_progress" && overallStatus === "not_started") {
            setOverallStatus("in_progress");
        }
    };

    // Handle next step
    const handleNextStep = () => {
        if (currentStep < verificationSteps.length - 1) {
            // Mark current step as completed
            updateStepStatus(currentStep, "completed");

            // Move to next step and mark it as in progress
            setCurrentStep(currentStep + 1);
            updateStepStatus(currentStep + 1, "in_progress");
        } else {
            // Final step completion
            updateStepStatus(currentStep, "completed");
            setOverallStatus("completed");
        }
    };

    // Handle previous step
    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Simulate file upload
    const handleFileUpload = (documentType: string) => {
        // This is a mock function that would normally handle file uploads
        // For demo purposes, we'll just simulate a successful upload
        setIsSubmitting(true);

        setTimeout(() => {
            setUploadedFiles({
                ...uploadedFiles,
                [documentType]: `${documentType}_${Date.now()}.pdf`
            });
            setIsSubmitting(false);
        }, 1500);
    };

    // Handle final submission
    const handleSubmitVerification = () => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            updateStepStatus(currentStep, "completed");
            setOverallStatus("completed");
            setIsSubmitting(false);
        }, 2000);
    };


    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 0: // Personal Information
                return Boolean(firstName && lastName && dateOfBirth && nationality && phoneNumber && email);

            case 1: // Identity Verification
                return Boolean(uploadedFiles["id_front"] && uploadedFiles["id_back"] && uploadedFiles["selfie"]);

            case 2: // Address Verification
                return Boolean(streetAddress && city && state && postalCode && country && uploadedFiles["address_proof"]);

            case 3: // Business Information (for business users)
                if (userType === "business") {
                    return Boolean(companyName && businessType && registrationNumber && taxId && incorporationDate && businessAddress);
                }
                return true;

            case 4: // Business Documents (for business users)
                if (userType === "business") {
                    return Boolean(
                        uploadedFiles["business_certificate"] &&
                        uploadedFiles["tax_certificate"] &&
                        uploadedFiles["business_address"]
                    );
                }
                return true;

            default:
                return true;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Verification & KYC
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Complete the verification process to unlock all platform features
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Verification Status
                        </p>
                        <div className="flex items-center">
                            {overallStatus === "not_started" && (
                                <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400">
                                    Not Started
                                </Badge>
                            )}
                            {overallStatus === "in_progress" && (
                                <Badge className="bg-amber-500 hover:bg-amber-600">
                                    In Progress
                                </Badge>
                            )}
                            {overallStatus === "completed" && (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                    Verified
                                </Badge>
                            )}
                            {overallStatus === "rejected" && (
                                <Badge className="bg-red-500 hover:bg-red-600">
                                    Rejected
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Verification Progress</span>
                    <span className="font-medium">{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Verification steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Steps navigation */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Verification Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3">
                            <div className="space-y-1">
                                {verificationSteps.map((step, index) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setCurrentStep(index)}
                                        disabled={step.status === "not_started" && index !== 0}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm transition-colors ${currentStep === index
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            } ${step.status === "not_started" && index !== 0
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                    >
                                        <span className="flex items-center">
                                            <span className={`flex-shrink-0 w-6 h-6 rounded-full mr-3 flex items-center justify-center ${step.status === "completed"
                                                ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                                : step.status === "in_progress"
                                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                                    : step.status === "rejected"
                                                        ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                }`}>
                                                {step.status === "completed" ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : step.status === "rejected" ? (
                                                    <X className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs">{index + 1}</span>
                                                )}
                                            </span>
                                            {step.title}
                                        </span>

                                        {currentStep === index && (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help card */}
                    <Card className="mt-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-3">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-sm">
                                        What documents do I need?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Government-issued photo ID (passport, driver's license)</li>
                                            <li>Proof of address (utility bill, bank statement)</li>
                                            {userType === "business" && (
                                                <>
                                                    <li>Business registration certificate</li>
                                                    <li>Tax identification documents</li>
                                                    <li>Proof of business address</li>
                                                </>
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-sm">
                                        How long does verification take?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                        Individual verification typically takes 1-2 business days. Business verification may take 3-5 business days as we carefully review all submitted documents.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-sm">
                                        Why do I need to verify my identity?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                        Identity verification helps us maintain a secure platform, prevent fraud, and comply with regulatory requirements for financial services.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-slate-700 dark:text-slate-300 text-sm">
                                <p className="flex items-start">
                                    <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" />
                                    Still have questions? Our support team is available 24/7 to assist you.
                                </p>
                                <Button variant="link" className="h-auto p-0 mt-1 text-blue-600 dark:text-blue-400">
                                    Contact Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Current step content */}
                <div className="md:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>{verificationSteps[currentStep].title}</CardTitle>
                                    <CardDescription>
                                        {verificationSteps[currentStep].description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Personal Information */}
                                    {verificationSteps[currentStep].id === "personal" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">
                                                        First Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="Enter your first name"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="middleName">Middle Name</Label>
                                                    <Input
                                                        id="middleName"
                                                        placeholder="Enter your middle name"
                                                        value={middleName}
                                                        onChange={(e) => setMiddleName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">
                                                        Last Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="Enter your last name"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="dateOfBirth">
                                                        Date of Birth <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="dateOfBirth"
                                                        type="date"
                                                        value={dateOfBirth}
                                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="gender">
                                                        Gender <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={gender} onValueChange={setGender}>
                                                        <SelectTrigger id="gender">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="nationality">
                                                        Nationality <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={nationality} onValueChange={setNationality}>
                                                        <SelectTrigger id="nationality">
                                                            <SelectValue placeholder="Select nationality" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="nigeria">Nigeria</SelectItem>
                                                            <SelectItem value="ghana">Ghana</SelectItem>
                                                            <SelectItem value="kenya">Kenya</SelectItem>
                                                            <SelectItem value="south_africa">South Africa</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phoneNumber">
                                                        Phone Number <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        placeholder="+234..."
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Identity Verification */}
                                    {verificationSteps[currentStep].id === "identity" && (
                                        <div className="space-y-6">
                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                <h3 className="text-base font-medium mb-2">Identity Document</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    Upload a clear photo of your government-issued ID (National ID, Passport, Driver's license)
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Front of ID */}
                                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col items-center justify-center">
                                                            {uploadedFiles["id_front"] ? (
                                                                <div className="relative w-full">
                                                                    <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                            {uploadedFiles["id_front"]}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const files = { ...uploadedFiles };
                                                                                delete files["id_front"];
                                                                                setUploadedFiles(files);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                        <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">Front of ID</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                        JPG, PNG or PDF, max 5MB
                                                                    </p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("id_front")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-4 w-4 mr-2" />
                                                                        )}
                                                                        Select File
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Back of ID */}
                                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col items-center justify-center">
                                                            {uploadedFiles["id_back"] ? (
                                                                <div className="relative w-full">
                                                                    <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                            {uploadedFiles["id_back"]}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const files = { ...uploadedFiles };
                                                                                delete files["id_back"];
                                                                                setUploadedFiles(files);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                        <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">Back of ID</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                        JPG, PNG or PDF, max 5MB
                                                                    </p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("id_back")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-4 w-4 mr-2" />
                                                                        )}
                                                                        Select File
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                <h3 className="text-base font-medium mb-2">Selfie Verification</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    Take a clear selfie photo of your face for identity verification
                                                </p>

                                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6">
                                                    <div className="flex flex-col items-center justify-center">
                                                        {uploadedFiles["selfie"] ? (
                                                            <div className="relative w-full max-w-xs mx-auto">
                                                                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                        {uploadedFiles["selfie"]}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const files = { ...uploadedFiles };
                                                                            delete files["selfie"];
                                                                            setUploadedFiles(files);
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                                                                    <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                                <p className="text-sm font-medium mb-1">Take a Selfie</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center max-w-xs">
                                                                    Make sure your face is clearly visible and well-lit
                                                                </p>
                                                                <div className="flex gap-3">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("selfie")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <Upload className="h-4 w-4 mr-2" />
                                                                        Upload Photo
                                                                    </Button>
                                                                    <Button
                                                                        className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                                                        size="sm"
                                                                        onClick={() => handleFileUpload("selfie")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <Camera className="h-4 w-4 mr-2" />
                                                                        Take Photo
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address Verification */}
                                    {verificationSteps[currentStep].id === "address" && (
                                        <div className="space-y-6">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="streetAddress">
                                                        Street Address <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="streetAddress"
                                                        placeholder="Enter your street address"
                                                        value={streetAddress}
                                                        onChange={(e) => setStreetAddress(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">
                                                            City <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="city"
                                                            placeholder="Enter your city"
                                                            value={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="state">
                                                            State/Province <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="state"
                                                            placeholder="Enter your state or province"
                                                            value={state}
                                                            onChange={(e) => setState(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="postalCode">
                                                            Postal/ZIP Code <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="postalCode"
                                                            placeholder="Enter your postal code"
                                                            value={postalCode}
                                                            onChange={(e) => setPostalCode(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="country">
                                                            Country <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select value={country} onValueChange={setCountry}>
                                                            <SelectTrigger id="country">
                                                                <SelectValue placeholder="Select your country" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="nigeria">Nigeria</SelectItem>
                                                                <SelectItem value="ghana">Ghana</SelectItem>
                                                                <SelectItem value="kenya">Kenya</SelectItem>
                                                                <SelectItem value="south_africa">South Africa</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="residenceDuration">
                                                        How long have you lived at this address? <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={residenceDuration} onValueChange={setResidenceDuration}>
                                                        <SelectTrigger id="residenceDuration">
                                                            <SelectValue placeholder="Select duration" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="less_than_6_months">Less than 6 months</SelectItem>
                                                            <SelectItem value="6_to_12_months">6-12 months</SelectItem>
                                                            <SelectItem value="1_to_3_years">1-3 years</SelectItem>
                                                            <SelectItem value="3_to_5_years">3-5 years</SelectItem>
                                                            <SelectItem value="more_than_5_years">More than 5 years</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                <h3 className="text-base font-medium mb-3">Proof of Address</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    Upload a document to verify your address (utility bill, bank statement, etc.) issued within the last 3 months
                                                </p>

                                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                    <div className="flex flex-col items-center justify-center">
                                                        {uploadedFiles["address_proof"] ? (
                                                            <div className="relative w-full">
                                                                <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                        {uploadedFiles["address_proof"]}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const files = { ...uploadedFiles };
                                                                            delete files["address_proof"];
                                                                            setUploadedFiles(files);
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                    <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                </div>
                                                                <p className="text-sm font-medium">Proof of Address</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                    JPG, PNG or PDF, max 5MB
                                                                </p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex items-center"
                                                                    onClick={() => handleFileUpload("address_proof")}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    {isSubmitting ? (
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <Upload className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Select File
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Business Information (only for business users) */}
                                    {verificationSteps[currentStep].id === "business" && userType === "business" && (
                                        <div className="space-y-6">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="companyName">
                                                        Company Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="companyName"
                                                        placeholder="Enter your company name"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="businessType">
                                                            Business Type <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Select value={businessType} onValueChange={setBusinessType}>
                                                            <SelectTrigger id="businessType">
                                                                <SelectValue placeholder="Select business type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                                                <SelectItem value="partnership">Partnership</SelectItem>
                                                                <SelectItem value="corporation">Corporation</SelectItem>
                                                                <SelectItem value="llc">Limited Liability Company</SelectItem>
                                                                <SelectItem value="ngo">Non-Profit Organization</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="incorporationDate">
                                                            Incorporation Date <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="incorporationDate"
                                                            type="date"
                                                            value={incorporationDate}
                                                            onChange={(e) => setIncorporationDate(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="registrationNumber">
                                                            Registration Number <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="registrationNumber"
                                                            placeholder="Enter registration number"
                                                            value={registrationNumber}
                                                            onChange={(e) => setRegistrationNumber(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="taxId">
                                                            Tax ID <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id="taxId"
                                                            placeholder="Enter tax ID"
                                                            value={taxId}
                                                            onChange={(e) => setTaxId(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="businessAddress">
                                                        Business Address <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Textarea
                                                        id="businessAddress"
                                                        placeholder="Enter business address"
                                                        value={businessAddress}
                                                        onChange={(e) => setBusinessAddress(e.target.value)}
                                                        required
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="businessWebsite">
                                                        Business Website
                                                    </Label>
                                                    <Input
                                                        id="businessWebsite"
                                                        placeholder="https://..."
                                                        value={businessWebsite}
                                                        onChange={(e) => setBusinessWebsite(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Business Documents (only for business users) */}
                                    {verificationSteps[currentStep].id === "documents" && userType === "business" && (
                                        <div className="space-y-6">
                                            <div className="grid gap-6">
                                                {/* Registration Certificate */}
                                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                    <h3 className="text-base font-medium mb-2">Business Registration Certificate</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                        Upload a copy of your business registration certificate
                                                    </p>

                                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col items-center justify-center">
                                                            {uploadedFiles["business_certificate"] ? (
                                                                <div className="relative w-full">
                                                                    <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                            {uploadedFiles["business_certificate"]}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const files = { ...uploadedFiles };
                                                                                delete files["business_certificate"];
                                                                                setUploadedFiles(files);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                        <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">Registration Certificate</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                        JPG, PNG or PDF, max 5MB
                                                                    </p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("business_certificate")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-4 w-4 mr-2" />
                                                                        )}
                                                                        Select File
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tax Certificate */}
                                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                    <h3 className="text-base font-medium mb-2">Tax Certificate</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                        Upload a copy of your tax certificate or VAT registration
                                                    </p>

                                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col items-center justify-center">
                                                            {uploadedFiles["tax_certificate"] ? (
                                                                <div className="relative w-full">
                                                                    <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                            {uploadedFiles["tax_certificate"]}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const files = { ...uploadedFiles };
                                                                                delete files["tax_certificate"];
                                                                                setUploadedFiles(files);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                        <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">Tax Certificate</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                        JPG, PNG or PDF, max 5MB
                                                                    </p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("tax_certificate")}
                                                                        disabled={isSubmitting}>
                                                                        {isSubmitting ? (
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-4 w-4 mr-2" />
                                                                        )}
                                                                        Select File
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Proof of Business Address */}
                                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                    <h3 className="text-base font-medium mb-2">Proof of Business Address</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                        Upload a utility bill or lease agreement showing your business address
                                                    </p>

                                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <div className="flex flex-col items-center justify-center">
                                                            {uploadedFiles["business_address"] ? (
                                                                <div className="relative w-full">
                                                                    <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between">
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                                                                            {uploadedFiles["business_address"]}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const files = { ...uploadedFiles };
                                                                                delete files["business_address"];
                                                                                setUploadedFiles(files);
                                                                            }}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                                        <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">Address Document</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
                                                                        JPG, PNG or PDF, max 5MB
                                                                    </p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center"
                                                                        onClick={() => handleFileUpload("business_address")}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {isSubmitting ? (
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        ) : (
                                                                            <Upload className="h-4 w-4 mr-2" />
                                                                        )}
                                                                        Select File
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Final Review */}
                                    {verificationSteps[currentStep].id === "review" && (
                                        <div className="space-y-6">
                                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                                <div className="flex">
                                                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h3 className="font-medium text-blue-700 dark:text-blue-300">Verification Review</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            Please review all the information you've provided before submitting for verification. Make sure all details are accurate and documents are valid.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Personal Information Review */}
                                                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                                                        <h3 className="font-medium">Personal Information</h3>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-blue-600 dark:text-blue-400"
                                                            onClick={() => setCurrentStep(0)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>

                                                    <div className="p-4">
                                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                                            <div>
                                                                <dt className="text-slate-500 dark:text-slate-400">Full Name</dt>
                                                                <dd className="font-medium mt-1">
                                                                    {firstName} {middleName ? middleName + ' ' : ''}{lastName}
                                                                </dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-slate-500 dark:text-slate-400">Date of Birth</dt>
                                                                <dd className="font-medium mt-1">{dateOfBirth || "Not provided"}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-slate-500 dark:text-slate-400">Nationality</dt>
                                                                <dd className="font-medium mt-1 capitalize">{nationality || "Not provided"}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-slate-500 dark:text-slate-400">Contact</dt>
                                                                <dd className="font-medium mt-1">
                                                                    {email || "No email"} / {phoneNumber || "No phone"}
                                                                </dd>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                </div>

                                                {/* Address Information Review */}
                                                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                                                        <h3 className="font-medium">Address Information</h3>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-blue-600 dark:text-blue-400"
                                                            onClick={() => setCurrentStep(2)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>

                                                    <div className="p-4">
                                                        <dl className="space-y-3 text-sm">
                                                            <div>
                                                                <dt className="text-slate-500 dark:text-slate-400">Address</dt>
                                                                <dd className="font-medium mt-1">
                                                                    {streetAddress || "Not provided"}
                                                                </dd>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">City</dt>
                                                                    <dd className="font-medium mt-1">{city || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">State/Province</dt>
                                                                    <dd className="font-medium mt-1">{state || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Postal/ZIP Code</dt>
                                                                    <dd className="font-medium mt-1">{postalCode || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Country</dt>
                                                                    <dd className="font-medium mt-1 capitalize">{country || "Not provided"}</dd>
                                                                </div>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                </div>

                                                {/* Document Uploads Review */}
                                                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                                                        <h3 className="font-medium">Document Uploads</h3>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-blue-600 dark:text-blue-400"
                                                            onClick={() => setCurrentStep(1)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>

                                                    <div className="p-4">
                                                        <ul className="space-y-3 text-sm">
                                                            <li className="flex items-center justify-between">
                                                                <span className="text-slate-700 dark:text-slate-300">Identity Document (Front)</span>
                                                                {uploadedFiles["id_front"] ? (
                                                                    <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                        Missing
                                                                    </Badge>
                                                                )}
                                                            </li>
                                                            <li className="flex items-center justify-between">
                                                                <span className="text-slate-700 dark:text-slate-300">Identity Document (Back)</span>
                                                                {uploadedFiles["id_back"] ? (
                                                                    <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                        Missing
                                                                    </Badge>
                                                                )}
                                                            </li>
                                                            <li className="flex items-center justify-between">
                                                                <span className="text-slate-700 dark:text-slate-300">Selfie Verification</span>
                                                                {uploadedFiles["selfie"] ? (
                                                                    <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                        Missing
                                                                    </Badge>
                                                                )}
                                                            </li>
                                                            <li className="flex items-center justify-between">
                                                                <span className="text-slate-700 dark:text-slate-300">Proof of Address</span>
                                                                {uploadedFiles["address_proof"] ? (
                                                                    <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                        Missing
                                                                    </Badge>
                                                                )}
                                                            </li>

                                                            {/* Business-specific documents review */}
                                                            {userType === "business" && (
                                                                <>
                                                                    <li className="flex items-center justify-between">
                                                                        <span className="text-slate-700 dark:text-slate-300">Business Registration Certificate</span>
                                                                        {uploadedFiles["business_certificate"] ? (
                                                                            <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                        ) : (
                                                                            <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                                Missing
                                                                            </Badge>
                                                                        )}
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                        <span className="text-slate-700 dark:text-slate-300">Tax Certificate</span>
                                                                        {uploadedFiles["tax_certificate"] ? (
                                                                            <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                        ) : (
                                                                            <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                                Missing
                                                                            </Badge>
                                                                        )}
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                        <span className="text-slate-700 dark:text-slate-300">Proof of Business Address</span>
                                                                        {uploadedFiles["business_address"] ? (
                                                                            <Badge className="bg-green-500 hover:bg-green-600">Uploaded</Badge>
                                                                        ) : (
                                                                            <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400">
                                                                                Missing
                                                                            </Badge>
                                                                        )}
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Business Information Review (only for business) */}
                                                {userType === "business" && (
                                                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                                                            <h3 className="font-medium">Business Information</h3>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-blue-600 dark:text-blue-400"
                                                                onClick={() => setCurrentStep(3)}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </div>

                                                        <div className="p-4">
                                                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Company Name</dt>
                                                                    <dd className="font-medium mt-1">
                                                                        {companyName || "Not provided"}
                                                                    </dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Business Type</dt>
                                                                    <dd className="font-medium mt-1 capitalize">
                                                                        {businessType.replace('_', ' ') || "Not provided"}
                                                                    </dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Registration Number</dt>
                                                                    <dd className="font-medium mt-1">{registrationNumber || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Tax ID</dt>
                                                                    <dd className="font-medium mt-1">{taxId || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Incorporation Date</dt>
                                                                    <dd className="font-medium mt-1">{incorporationDate || "Not provided"}</dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="text-slate-500 dark:text-slate-400">Website</dt>
                                                                    <dd className="font-medium mt-1">{businessWebsite || "Not provided"}</dd>
                                                                </div>
                                                            </dl>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Declaration and consent */}
                                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                    <h3 className="font-medium mb-3">Declaration and Consent</h3>

                                                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                                        <p>
                                                            I hereby declare that all information provided is true, accurate, and complete to the best of my knowledge. I understand that providing false or misleading information may result in the rejection of my application or termination of my account.
                                                        </p>
                                                        <p>
                                                            I consent to the collection, processing, and storage of my personal information for the purpose of identity verification, fraud prevention, and compliance with regulatory requirements.
                                                        </p>
                                                        <p>
                                                            I understand that RealPayTag may contact me for additional information or documents if necessary.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                                    {currentStep > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={handlePrevStep}
                                            disabled={isSubmitting}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-2" />
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep === 0 && (
                                        <Button
                                            variant="outline"
                                            className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white invisible"
                                        >
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep < verificationSteps.length - 1 ? (
                                        <Button
                                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                            onClick={handleNextStep}
                                            disabled={!validateCurrentStep() || isSubmitting}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                                            onClick={handleSubmitVerification}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Verification
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Helper function to validate current step (moved outside for clarity)


export default VerificationKYC;