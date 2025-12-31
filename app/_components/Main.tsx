"use client";
import { BsStars } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { GrNext } from "react-icons/gr";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { TakeQuiz } from "./TakeQuiz";

export const MainPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false);

  // SUMMURY USESTATE SHUU
  const [summary, setSummary] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "summary">("form");
  // summary dotor see content harah useState
  const [seeContent, setSeeContent] = useState(false);

  // ene bol CLERK
  const { user } = useUser();

  const handleGenerateSummary = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title болон content хоёулаа шаардлагатай");
      return;
    }

    if (!user?.id) {
      setError("Нэвтэрнэ үү");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // setSuccess(false);

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          userId: user.id,
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
      setStep("summary");

      if (!response.ok) {
        throw new Error(data.error || "Article үүсгэхэд алдаа гарлаа");
      }

      // setSuccess(true);
      // setTitle("");
      // setContent("");

      console.log("Article амжилттай үүслээ:", data);
    } catch (error) {
      console.error("Алдаа:", error);
      setError(error instanceof Error ? error.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };
  // SUMMARY (2.2)
  if (step === "summary" && summary) {
    return (
      <>
        <div
          className="w-12 h-10 bg-white border border-gray-300 rounded-lg flex justify-center items-center "
          onClick={() => setStep("form")}
        >
          <MdArrowBackIos />
        </div>
        <div className="w-[628px] rounded-lg border border-gray-200 mt-15 ">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BsStars size={28} />
              <h3 className="text-2xl font-bold">Article Quiz Generator</h3>
            </div>
            <p className="text-gray-500 mb-2">Summarized content</p>

            <h4 className="text-lg font-semibold mb-3">{title}</h4>

            <p className="text-gray-700 leading-relaxed mb-6">{summary}</p>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 border rounded-lg cursor-pointer"
                onClick={() => {
                  setSeeContent(true);
                }}
              >
                See content
              </button>
              <TakeQuiz />
              {seeContent && (
                <div
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  onClick={() => setSeeContent(false)}
                >
                  <div
                    className=" w-[520px] max-h-[420px] bg-white rounded-x shadow-xl p-6 overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-black"
                      onClick={() => setSeeContent(false)}
                    >
                      ✕
                    </button>

                    <h3 className="text-xl font-semibold mb-4">{title}</h3>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="w-12 h-10 bg-white border border-gray-300 rounded-lg flex justify-center items-center "
        onClick={() => setStep("summary")}
      >
        <GrNext />
      </div>
      <div className="w-[628px] h-[442px] rounded-lg border border-gray-200 mt-15 ">
        <div className="p-5">
          <div className="flex items-center gap-2">
            <BsStars size={30} />
            <h3 className="text-3xl font-bold">Article Quiz Generator</h3>
          </div>
          <p className="text-gray-500 mt-2">
            Paste your article below to generate a summarize and quiz question.
            Your articles will saved in the sidebar for future reference.
          </p>
          <div className="flex items-center mt-5 gap-2">
            <FaFileAlt size={20} />
            <p className="text-gray-500  ">New Article</p>
          </div>
          <input
            className="w-full h-10 rounded-lg border border-gray-300 mt-2 pl-2"
            placeholder="Enter a title for your article..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center mt-5 gap-2">
            <FaFileAlt size={20} />
            <p className="text-gray-500  ">Article content </p>
          </div>
          <textarea
            className="w-full h-[120px] rounded-lg border border-gray-300 mt-2 p-2"
            placeholder="Paste your article content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

          <div className="flex justify-between mt-4">
            <p></p>
            <button
              className="w-40 h-10 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateSummary}
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? "Үүсгэж байна..." : "Generate Quiz"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
