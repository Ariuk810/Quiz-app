import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSideBar";
import { MainPage } from "./_components/Main";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
export default async function Home() {
  return (
    <>
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
        </header>{" "}
      </div>
      <div className="flex w-full h-[calc(100vh-60px)]">
        <SidebarProvider className="">
          <AppSidebar />
          <main className="w-full h-full  flex  justify-center">
            <MainPage />
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
