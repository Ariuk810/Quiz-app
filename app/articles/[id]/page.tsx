"use client";

import { TakeQuiz } from "@/app/_components/TakeQuiz";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { LuBookOpen } from "react-icons/lu";
type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
};

export default function ArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  console.log(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [seemore, setSeemore] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/article/${id}`, { method: "GET" });
        const data = await res.json();
        if (isMounted) setArticle(data);
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);
  // console.log(article);

  return (
    <div className="w-[628px] h-auto rounded-lg border border-gray-200 mt-15">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BsStars size={28} />
          <h3 className="text-2xl font-bold">Article Quiz Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <LuBookOpen size={15} />
          <p className="text-gray-500 ">Summarized content</p>
        </div>
        <h4 className="text-2xl font-semibold mt-5">{article?.title}</h4>

        <p className="text-gray-700 leading-relaxed mt-5">{article?.summary}</p>
        <div className="flex items-center gap-2 mt-3">
          <LuBookOpen size={15} />
          <p className="text-gray-500 ">Article content</p>
        </div>

        <p className="text-gray-700 leading-relaxed mt-5">
          {article?.content.slice(0, 400)}
        </p>
        <div className="flex justify-between">
          <p></p>
          <p onClick={() => setSeemore(true)} className="cursor-pointer">
            See more ....
          </p>
        </div>
        <TakeQuiz />
        {seemore && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSeemore(false)}
          >
            <div
              className=" w-[520px] max-h-[420px] bg-white rounded-x shadow-xl p-6 overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
                onClick={() => setSeemore(false)}
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-4">{article?.title}</h3>

              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {article?.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
