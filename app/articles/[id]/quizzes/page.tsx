"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Quiz = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

const TakeQuiz = () => {
  const params = useParams();
  const id = params?.id as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true); // ⬅️ анхнаасаа true
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResult, setShowResult] = useState(false);

  const loadOrGenerateQuiz = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/article/${id}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numQuestions: 5 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load quizzes");
      }

      // таны API: { quizzes: [...] } гэж буцаана гэж үзлээ
      setQuizzes(data.quizzes ?? []);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Page рүү ороход автоматаар дуудагдана
  useEffect(() => {
    loadOrGenerateQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSelect = (quizId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: option }));

    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= quizzes.length) {
          setShowResult(true);
          return prev; // сүүлийнх дээрээ үлдээнэ
        }
        return next;
      });
    }, 300);
  };

  const score = quizzes.filter(
    (q) => selectedAnswers[q.id] === q.answer,
  ).length;

  // ✅ Loading үед: button биш, шууд loading UI
  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-3">
        <p className="text-sm text-gray-500">Preparing your quiz…</p>
        <div className="h-10 w-full rounded bg-gray-100 animate-pulse" />
        <div className="h-24 w-full rounded bg-gray-100 animate-pulse" />
        <div className="h-24 w-full rounded bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // ✅ Error гарвал
  if (error) {
    return (
      <div className="max-w-md mx-auto space-y-3">
        <p className="text-red-600">{error}</p>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={loadOrGenerateQuiz}
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Хоосон ирвэл
  if (quizzes.length === 0) {
    return (
      <div className="max-w-md mx-auto space-y-3">
        <p className="text-gray-600">No quizzes found.</p>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={loadOrGenerateQuiz}
        >
          Generate again
        </button>
      </div>
    );
  }

  // ✅ Result
  if (showResult) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">Quiz completed</h2>
        <p>
          Your score: {score} / {quizzes.length}
        </p>

        {quizzes.map((quiz, index) => {
          const userAnswer = selectedAnswers[quiz.id];
          const correct = userAnswer === quiz.answer;

          return (
            <div key={quiz.id} className="border p-3 rounded">
              <p className="font-medium">
                {index + 1}. {quiz.question}
              </p>

              <p className={correct ? "text-green-600" : "text-red-600"}>
                Your answer: {userAnswer}
              </p>

              {!correct && (
                <p className="text-green-600">Correct: {quiz.answer}</p>
              )}
            </div>
          );
        })}

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4"
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswers({});
              setShowResult(false);
            }}
          >
            Restart Quiz
          </button>

          <button className="px-4 py-2 bg-black text-white rounded-lg mt-4">
            Save and leave
          </button>
        </div>
      </div>
    );
  }

  // ✅ Quiz question view
  const quiz = quizzes[currentIndex];
  const selected = selectedAnswers[quiz.id];

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-sm text-gray-500">
        {currentIndex + 1} / {quizzes.length}
      </p>

      <h2 className="font-semibold">{quiz.question}</h2>

      <div className="grid grid-cols-2 gap-2">
        {quiz.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(quiz.id, option)}
            className={`border rounded px-3 py-2 ${
              selected === option ? "bg-black text-white" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TakeQuiz;
