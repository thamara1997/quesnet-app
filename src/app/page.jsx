"use client";

import { useState, useEffect } from "react";
import QuestionCard from "@/components/questionCard/QuestionCard";

// import { questions } from "@/lib/data";

export default function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3000/api/question", {
          cache: "no-store",
        });
        const questions = await res.json();

        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="flex justify-center w-full mx-auto mt-10 max-sm:w-[95%]">
      <div className="grid grid-cols-4 gap-10 max-sm:grid-cols-1">
        {questions?.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <h3 className="items-center w-full col-span-4 mt-10 text-center">
            No Questions are currently Here
          </h3>
        )}
      </div>
    </div>
  );
}
