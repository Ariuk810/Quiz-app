import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/article/[articleId] - Update an article
export async function POST(
  request: NextRequest,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = params.articleId;
    const body = await request.json();
    const { title, content, summary } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(summary && { summary }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        quizzes: true,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}
