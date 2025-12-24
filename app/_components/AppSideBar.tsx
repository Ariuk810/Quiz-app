"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
interface Article {
  id: string;
  title: string;
  createdAt: string;
}

export function AppSidebar() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/articles?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user?.id]);

  return (
    <Sidebar className="">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5 mt-5">
              {loading ? (
                <SidebarMenuItem>
                  <span className="text-gray-500">Loading...</span>
                </SidebarMenuItem>
              ) : articles.length === 0 ? (
                <SidebarMenuItem>
                  <span className="text-gray-500">No articles yet</span>
                </SidebarMenuItem>
              ) : (
                articles.map((article) => (
                  <SidebarMenuItem key={article.id}>
                    <SidebarMenuButton asChild className="text-[18px]">
                      <span
                        className="truncate"
                        onClick={() => router.push(`articles/${article.id}`)}
                      >
                        {article.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarTrigger className="absolute left-[260px] top-3" />
      </SidebarContent>
    </Sidebar>
  );
}
