import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/article/[articleId] - Update an article
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const body = await request.json();
    const { title, content, summary } = body;

    if (!title && !content && !summary) {
      return NextResponse.json(
        {
          error:
            "At least one field (title, content, summary) must be provided",
        },
        { status: 400 }
      );
    }

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
        updatedAt: new Date(),
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

// /api/article/jodisjaoida => article data
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) => {
  try {
    const { articleId } = await params;

    console.log(articleId);
  } catch (err) {}
};
