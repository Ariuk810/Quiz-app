import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Quiz app with Clerk auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="w-full h-15 flex justify-between p-5">
            <p className="text-black text-2xl">Quiz app</p>
            <header className="flex items-center justify-end h-14 px-6 border-b">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="ml-3 rounded-full bg-[#6c47ff] px-4 py-2 text-sm font-medium text-white">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
          </div>
          <SidebarProvider>
            <div className="flex w-full h-[calc(100vh-60px)]">
              <AppSidebar />
              <main className="flex-1 p-6 overflow-auto flex justify-center">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
