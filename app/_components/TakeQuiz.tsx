"use client";

import { useParams } from "next/navigation";

export const TakeQuiz = () => {
  const { id } = useParams();

  const handleTakeQuiz = async () => {
    try {
      const res = await fetch(`/api/article/${id}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numQuestions: 5 }),
      });

      const data = await res.json();

      console.log(data);
    } catch (err: unknown) {
      console.error("Failed to load quizzes", err);
    }
  };
  return (
    <button
      className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
      onClick={handleTakeQuiz}
    >
      Take a quiz
    </button>
  );
};
