// "use client";

// import { useParams } from "next/navigation";
// import { useState } from "react";

// type Quiz = {
//   id: string;
//   question: string;
//   options: string[];
//   answer: string;
// };

// export const TakeQuiz = () => {
//   const { id } = useParams();
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<
//     Record<string, string>
//   >({});
//   const [showResult, setShowResult] = useState(false);

//   const handleTakeQuiz = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/article/${id}/quizzes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ numQuestions: 5 }),
//       });

//       const data = await res.json();

//       console.log(data);
//       setQuizzes(data.quizzes);
//     } catch (err: unknown) {
//       console.error("Failed to load quizzes", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSelect = (quizId: string, option: string) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [quizId]: option,
//     }));

//     // 🔥 автоматаар дараагийн асуулт руу
//     setTimeout(() => {
//       if (currentIndex < quizzes.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//       } else {
//         setShowResult(true);
//       }
//     }, 300); // 0.3 сек delay (UX-д гоё)
//   };

//   const score = quizzes.filter(
//     (q) => selectedAnswers[q.id] === q.answer,
//   ).length;

//   // 1️⃣ Quiz эхлээгүй үед
//   if (quizzes.length === 0) {
//     return (
//       <button
//         className="px-4 py-2 bg-black text-white rounded-lg"
//         onClick={handleTakeQuiz}
//         disabled={loading}
//       >
//         {loading ? "Loading..." : "Take a quiz"}
//       </button>
//     );
//   }

//   // 2️⃣ Quiz дууссан үед
//   if (showResult) {
//     return (
//       <div className="max-w-md mx-auto space-y-4">
//         <h2 className="text-xl font-bold">Quiz completed</h2>
//         <p>
//           Your score: {score} / {quizzes.length}
//         </p>

//         {quizzes.map((quiz, index) => {
//           const userAnswer = selectedAnswers[quiz.id];
//           const correct = userAnswer === quiz.answer;

//           return (
//             <div key={quiz.id} className="border p-3 rounded">
//               <p className="font-medium">
//                 {index + 1}. {quiz.question}
//               </p>

//               <p className={correct ? "text-green-600" : "text-red-600"}>
//                 Your answer: {userAnswer}
//               </p>

//               {!correct && (
//                 <p className="text-green-600">Correct: {quiz.answer}</p>
//               )}
//             </div>
//           );
//         })}
//         <div className="flex justify-between">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4"
//             onClick={() => {
//               setCurrentIndex(0);
//               setSelectedAnswers({});
//               setShowResult(false);
//             }}
//           >
//             Restart Quiz
//           </button>
//           <button className="px-4 py-2 bg-black text-white rounded-lg mt-4 flex items-center">
//             Save and leave
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 3️⃣ Quiz явж байх үед
//   const quiz = quizzes[currentIndex];
//   const selected = selectedAnswers[quiz.id];

//   return (
//     <div className="max-w-md mx-auto space-y-4">
//       <p className="text-sm text-gray-500">
//         {currentIndex + 1} / {quizzes.length}
//       </p>

//       <h2 className="font-semibold">{quiz.question}</h2>

//       <div className="grid grid-cols-2 gap-2">
//         {quiz.options.map((option) => (
//           <button
//             key={option}
//             onClick={() => handleSelect(quiz.id, option)}
//             className={`border rounded px-3 py-2
//             ${selected === option ? "bg-black text-white" : ""}
//           `}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };
