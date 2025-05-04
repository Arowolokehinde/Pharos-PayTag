import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import Navbar from "@/components/layout/navbar";
import ElegantChatbot from "@/components/layout/ElegantChatbot";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RealPayTag</title>
        <meta name="description" content="RealPayTag Web3 Platform" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <Toaster position="top-center" />
            {/* <Navbar /> */}
            <main className="w-full">
              {children}
            </main>
            <Footer />
            <ElegantChatbot />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}