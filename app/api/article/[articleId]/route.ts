import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/article/[articleId] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;

    const article = await prisma.article.findFirst({
      where: { id: articleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// POST /api/article/[articleId] - Update article
export async function POST(
  request: NextRequest,
  { params }: { params: { articleId: string } }
) {
  try {
    const { articleId } = params;
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

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(summary && { summary }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
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
