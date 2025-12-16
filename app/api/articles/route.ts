import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/articles - Fetch all articles
export const GET = async (request: NextRequest) => {
  try {
    const articles = await prisma.article.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
};

// POST /api/articles - Create a new article
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { title, content, summary, userId } = body;

    if (!title || !content || !summary || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, summary, userId" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        userId,
      },
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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
};
