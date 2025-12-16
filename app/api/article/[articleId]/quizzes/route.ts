import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/article/[articleId]/quizzes - Create quizzes for an article
export async function POST(
  request: NextRequest,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = params.articleId;
    const body = await request.json();

    // Check if body contains a single quiz or array of quizzes
    const quizzes = Array.isArray(body.quizzes) ? body.quizzes : [body];

    // Validate that article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Validate quiz data
    for (const quiz of quizzes) {
      if (!quiz.question || !quiz.options || !quiz.answer) {
        return NextResponse.json(
          { error: "Each quiz must have question, options, and answer" },
          { status: 400 }
        );
      }

      if (!Array.isArray(quiz.options)) {
        return NextResponse.json(
          { error: "Options must be an array" },
          { status: 400 }
        );
      }

      if (!quiz.options.includes(quiz.answer)) {
        return NextResponse.json(
          { error: "Answer must be one of the options" },
          { status: 400 }
        );
      }
    }

    // Create quizzes
    const createdQuizzes = await Promise.all(
      quizzes.map((quiz: any) =>
        prisma.quiz.create({
          data: {
            question: quiz.question,
            options: quiz.options,
            answer: quiz.answer,
            articleId: articleId,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Quizzes created successfully",
        quizzes: createdQuizzes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quizzes:", error);
    return NextResponse.json(
      { error: "Failed to create quizzes" },
      { status: 500 }
    );
  }
}
