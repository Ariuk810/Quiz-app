import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// POST /api/generate - Generate article summary and quizzes (max 5 questions) from content using Gemini AI
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

    // Generate summary using Gemini
    const summaryPrompt = `Please generate a concise summary (around 200-300 words) for the following article:

Title: ${title}

Content:
${content}

Summary:`;

    const summaryResult = await model.generateContent(summaryPrompt);
    const summaryResponse = await summaryResult.response;
    const summary = summaryResponse.text().trim();

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

Title: ${title}

Content:
${content}

Summary: ${summary}

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
      quizzesToCreate.map(
        (quiz: { question: string; options: string[]; answer: string }) =>
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
