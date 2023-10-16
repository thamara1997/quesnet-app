import QuestionCard from "@/components/questionCard/QuestionCard";
// import { questions } from "@/lib/data";

export async function fetchQuestion() {
  const res = await fetch("http://localhost:3000/api/question", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const questions = await fetchQuestion();
  return (
    <div className="flex justify-center w-full mx-auto mt-10 max-sm:w-[95%]">
      <div className="grid grid-cols-4 gap-10 max-sm:grid-cols-1">
        {questions?.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <h3 className={classes.noBlogs}>No Questions are currently in the</h3>
        )}
      </div>
    </div>
  );
}
