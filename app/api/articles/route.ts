import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// GET /api/articles - Fetch all articles for the user
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") as string;

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });

    const articles = await prisma.article.findMany({
      where: { userId: user?.id },
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

// POST /api/articles - Create a new article with AI-generated summary
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { title, content, userId } = body;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    // Find or create user by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Ensure user exists after all operations
    if (!user) {
      return NextResponse.json(
        { error: "Failed to get or create user" },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate summary using Gemini
    const prompt = `Please generate a concise summary (around 1-3 sentences) for the following article: Title: ${title}. Content:${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // Create article with generated summary
    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        userId: user.id, // Use database user ID
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check for specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; meta?: any };
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "Database constraint error. Please try again." },
          { status: 409 }
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create article: ${errorMessage}` },
      { status: 500 }
    );
  }
};
