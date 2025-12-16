import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/generate - Generate article summary and quizzes from content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, userId } = body;

    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, userId" },
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

    // TODO: Integrate with AI service (OpenAI, Anthropic, etc.) to generate:
    // 1. Summary of the article
    // 2. Quiz questions with options and answers
    // For now, this is a placeholder structure

    // Placeholder summary generation (replace with actual AI call)
    const summary = content.substring(0, 200) + "..."; // Simple truncation as placeholder

    // Placeholder quiz generation (replace with actual AI call)
    // In a real implementation, you would call an AI service here
    const generatedQuizzes = [
      {
        question: "What is the main topic of this article?",
        options: ["Topic A", "Topic B", "Topic C", "Topic D"],
        answer: "Topic A",
      },
      {
        question: "What is a key point mentioned in the article?",
        options: ["Point 1", "Point 2", "Point 3", "Point 4"],
        answer: "Point 1",
      },
    ];

    // Create article
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

    // Create quizzes for the article
    const createdQuizzes = await Promise.all(
      generatedQuizzes.map((quiz) =>
        prisma.quiz.create({
          data: {
            question: quiz.question,
            options: quiz.options,
            answer: quiz.answer,
            articleId: article.id,
          },
        })
      )
    );

    return NextResponse.json(
      {
        article,
        quizzes: createdQuizzes,
        message: "Article and quizzes generated successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating article and quizzes:", error);
    return NextResponse.json(
      { error: "Failed to generate article and quizzes" },
      { status: 500 }
    );
  }
}
