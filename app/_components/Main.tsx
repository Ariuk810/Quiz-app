"use client";
import { BsStars } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

export const MainPage = () => {
  const { user } = useUser();
  console.log(user?.id);

  const router = useRouter();

  const handleGenerate = () => {
    // if (!isSignedIn) {
    //   alert("Please sign in to generate quiz");
    //   router.push("/sign-in");
    //   return;
    // }

    console.log("Generate quiz...");
  };
  return (
    <div className="w-[628px] h-[442px] rounded-lg border border-gray-200 mt-15">
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
        ></input>
        <div className="flex items-center mt-5 gap-2">
          <FaFileAlt size={20} />
          <p className="text-gray-500  ">Article content </p>
        </div>
        <textarea
          className="w-full h-[120px] rounded-lg border border-gray-300 mt-2 p-2"
          placeholder="Paste your article content here..."
        ></textarea>
        <div className="flex justify-between">
          <p></p>
          <button
            className="w-40 h-10 bg-gray-400 text-white rounded-lg  "
            onClick={handleGenerate}
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
