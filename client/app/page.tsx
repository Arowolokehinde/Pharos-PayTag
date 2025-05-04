"use client";

import WorkflowSection from "@/components/Landing/WorkflowSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import LiveDemoSection from "@/components/Landing/LiveDemoSection";
import UseCasesSection from "@/components/Landing/UseCasesSection";
import BlockchainNetworksSection from "@/components/Landing/BlockchainNetworksSection";
import CTASection from "@/components/Landing/CTASection";
import ResponsiveHeroSection from "@/components/Landing/ResponsiveHeroSection";
import EnhancedNavbar from "@/components/layout/navbar";
import NewsletterSubscription from "@/components/Landing/NewsletterSubscription";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-web3";
import { Dialog, DialogContent, } from "@/components/ui/dialog";
import { Tag } from "lucide-react";


export default function LandingPage() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paytag, setPaytag] = useState(false);

  useEffect(() => {
    // Only run this check if the user is connected
    if (isConnected) {
      const payTagSet = localStorage.getItem("pay-tag-set");
      if (payTagSet) router.push("/")

      // If pay-tag-set doesn't exist or is false, show redirect modal
      if (!payTagSet || payTagSet === "false") {
        setIsRedirecting(true);

        // Short delay before redirect to allow modal to be seen
        setTimeout(() => {
          router.push("/paytag");
          localStorage.setItem("pay-tag-set", "true");
          setPaytag(true)
        }, 2000);
      }
    }
  }, [isConnected, router]);




  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <EnhancedNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <ResponsiveHeroSection />

        {/* Workflow Section */}
        <WorkflowSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Live Demo Section */}
        <LiveDemoSection />

        {/* Use Cases Section */}
        <UseCasesSection />

        {/* Blockchain Networks Section */}
        <BlockchainNetworksSection />

        {/* CTA Section */}
        <CTASection />

      </main>
      <NewsletterSubscription />

      {/* PayTag Setup Modal */}
      {isRedirecting && (
        <Dialog open={isRedirecting} onOpenChange={() => { }}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-0 rounded-xl">
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Tag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Setting Up Your PayTag
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You need to create your unique @PayTag before continuing. Redirecting you to the registration page...
              </p>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-teal-500 animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}