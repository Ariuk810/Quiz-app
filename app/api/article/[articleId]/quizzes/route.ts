import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// POST /api/article/[articleId]/quizzes - Generate quizzes (max 5 questions) for an existing article using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;

    // Validate that article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        quizzes: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate quizzes using Gemini (maximum 5 questions)
    const quizPrompt = `Based on the following article, generate up to 5 multiple choice quiz questions. Each question should have:
- A clear, concise question
- 4 answer options (options should be in an array format)
- The correct answer (must be one of the options)

Generate maximum 5 questions. Format your response as a JSON array like this:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]

Title: ${article.title}

Content:
${article.content}

Summary: ${article.summary}

Return only the JSON array, no other text:`;

    const quizResult = await model.generateContent(quizPrompt);
    const quizResponse = await quizResult.response;
    const quizText = quizResponse.text().trim();

    // Parse JSON from response (may have markdown code blocks)
    let quizJson = quizText;
    if (quizText.includes("```json")) {
      quizJson = quizText.split("```json")[1].split("```")[0].trim();
    } else if (quizText.includes("```")) {
      quizJson = quizText.split("```")[1].split("```")[0].trim();
    }

    const generatedQuizzes = JSON.parse(quizJson);

    // Limit to maximum 5 questions
    const quizzesToCreate = generatedQuizzes.slice(0, 5);

    // Validate quiz data
    for (const quiz of quizzesToCreate) {
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
      quizzesToCreate.map(
        (quiz: { question: string; options: string[]; answer: string }) =>
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
        message: "Quizzes generated successfully",
        quizzes: createdQuizzes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating quizzes:", error);
    return NextResponse.json(
      { error: "Failed to generate quizzes" },
      { status: 500 }
    );
  }
}
