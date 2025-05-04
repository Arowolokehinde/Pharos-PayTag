"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-web3";


import Footer from "@/components/layout/Footer";
import WorkflowSection from "@/components/Landing/WorkflowSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import LiveDemoSection from "@/components/Landing/LiveDemoSection";
import UseCasesSection from "@/components/Landing/UseCasesSection";
import BlockchainNetworksSection from "@/components/Landing/BlockchainNetworksSection";
import CTASection from "@/components/Landing/CTASection";
import ResponsiveHeroSection from "@/components/Landing/ResponsiveHeroSection";
import EnhancedNavbar from "@/components/layout/navbar";
import NewsletterSubscription from "@/components/Landing/NewsletterSubscription";

export default function LandingPage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  // useEffect(() => {
  //   if (isConnected) {
  //     router.push("/dashboard");
  //   } else {
  //     router.push("/")
  //   }
  // }, [isConnected, router]);

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
      <NewsletterSubscription />ß

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}