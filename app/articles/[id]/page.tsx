"use client";

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

  const fetchArticle = async () => {
    try {
      const data = await (
        await fetch(`/api/article/${id}`, {
          method: "GET",
        })
      ).json();
      setArticle(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchArticle();
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
        <p className="text-gray-700 leading-relaxed mt-5">{article?.content}</p>
      </div>
    </div>
  );
}
