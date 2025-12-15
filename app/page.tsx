import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { AppSidebar } from "./_components/AppSideBar";
import { BsStars } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { MainPage } from "./_components/Main";
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  console.log(users, "user baina muubdfgvdjhnfvdsn");
  const articles = await prisma.article.findMany();
  console.log(articles, "article baineusduhcbsc");
  const quiz = await prisma.quiz.findMany();
  console.log(quiz, "quiz baina uuywtdvfuwydbv");

  return (
    <>
      <div className="w-full h-15 flex justify-between p-5">
        <p className="text-black text-2xl">Quiz app</p>
        <div className="w-9 h-9 rounded-full bg-red-500"></div>
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
