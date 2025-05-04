"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
    steps: Array<{ id: string; title: string; description: string }>;
    currentStep: number;
}

const ProgressSteps: FC<ProgressStepsProps> = ({ steps, currentStep }) => (
    <div className="flex justify-between mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>

        {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-0">
                <motion.div
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                        currentStep > index
                            ? "bg-gradient-to-br from-blue-600 to-teal-500 text-white border-transparent"
                            : currentStep === index
                                ? "bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                    )}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {currentStep > index ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                </motion.div>

                <div className="mt-2 text-center">
                    <span className={cn(
                        "text-xs font-medium block max-w-[80px]",
                        currentStep >= index
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-500"
                    )}>
                        {step.description}
                    </span>
                    {/* <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block">
                        {step.description}
                    </span> */}
                </div>
            </div>
        ))}
    </div>
);

export default ProgressSteps;



// "use client";

// import { FC } from "react";
// import { motion } from "framer-motion";
// import { CheckCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface RegistrationStep {
//     id: string;
//     title: string;
//     description: string;
// }

// interface ProgressStepProps {
//     steps: RegistrationStep[];
//     currentStep: number;
// }

// const ProgressSteps: FC<ProgressStepProps> = ({ steps, currentStep }) => {
//     return (
//         <div className="flex justify-between mb-8 relative">
//             {/* Connecting line */}
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>

//             {steps.map((step, index) => (
//                 <div key={step.id} className="flex flex-col items-center relative z-0">
//                     <motion.div
//                         className={cn(
//                             "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
//                             currentStep > index
//                                 ? "bg-gradient-to-br from-blue-600 to-teal-500 text-white border-transparent"
//                                 : currentStep === index
//                                     ? "bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
//                                     : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
//                         )}
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         transition={{ delay: index * 0.1 }}
//                     >
//                         {currentStep > index ? (
//                             <CheckCircle className="h-5 w-5" />
//                         ) : (
//                             <span>{index + 1}</span>
//                         )}
//                     </motion.div>

//                     <div className="mt-2 text-center">
//                         <span className={cn(
//                             "text-xs font-medium block max-w-[80px]",
//                             currentStep >= index
//                                 ? "text-blue-600 dark:text-blue-400"
//                                 : "text-slate-400 dark:text-slate-500"
//                         )}>
//                             {step.title}
//                         </span>
//                         <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block">
//                             {step.description}
//                         </span>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ProgressSteps;