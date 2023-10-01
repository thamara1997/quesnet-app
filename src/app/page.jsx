import QuestionCard from "@/components/questionCard/QuestionCard";
import { questions } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex justify-center w-full mx-auto mt-10 max-sm:w-[95%]">
      <div className="grid grid-cols-4 gap-10 max-sm:grid-cols-1">
        {questions.map((question) => (
          <QuestionCard key={question.title} question={question} />
        ))}
      </div>
    </div>
  );
}
