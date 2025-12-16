import prisma from "@/lib/prisma";

export const GET = async () => {
  const articles = await prisma.article.findMany();
  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
