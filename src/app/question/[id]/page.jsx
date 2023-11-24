"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlinePencilAlt } from "react-icons/hi";

import Avatar from "../../../assets/Avatar.png";
import AnswerCard from "@/components/Answer/AnswerCard";

import { BsEmojiSmile } from "react-icons/bs";
import { BsEmojiNeutral } from "react-icons/bs";
import { BsEmojiFrown } from "react-icons/bs";
import { BsEmojiHeartEyes } from "react-icons/bs";

const QuestionPage = (ctx) => {
  const [questionDetails, setQuestionData] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [quesLikes, setQuesLikes] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    async function fetchAnswers() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/answer/${ctx.params.id}`,
          { cache: "no-store" }
        );
        const answers = await res.json();

        // Log the fetched answers
        setAnswers(answers);
        //console.log("Fetched answers:", answers);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    }

    fetchAnswers();
  }, [ctx.params.id]);

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(
        `http://localhost:3000/api/question/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const ques = await res.json();

      setQuestionData(ques);
      setIsLiked(ques?.likes?.includes(session?.user?._id));
      setQuesLikes(ques?.likes?.length || 0);
    }
    session && fetchQuestion();
  }, [session]);

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to Delete this question?"
      );

      if (confirmModal) {
        const res = await fetch(
          `http://localhost:3000/api/question/${ctx.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            method: "DELETE",
          }
        );

        if (res.ok) {
          toast.success("Successfully Deleted");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/question/${ctx.params.id}/like`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
        }
      );

      //console.log(res);
      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setQuesLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setQuesLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = async (selectedAnswer) => {
    try {
      const body = {
        questionId: ctx.params.id,
        authorId: session?.user?._id,
        answer: selectedAnswer,
      };

      //console.log(body);

      const res = await fetch(`http://localhost:3000/api/answer`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(body),
      });

      const newAnswer = await res.json();

      setAnswers((prev) => {
        return [newAnswer, ...prev];
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to calculate the count of each answer type
  const getAnswerCounts = () => {
    const answerCounts = {};
    const totalAnswers = answers.length;

    answers.forEach((answer) => {
      const answerType = answer.answer;

      if (answerType in answerCounts) {
        answerCounts[answerType]++;
      } else {
        answerCounts[answerType] = 1;
      }
    });

    // Calculate percentages
    const answerPercentages = {};
    Object.entries(answerCounts).forEach(([answerType, count]) => {
      answerPercentages[answerType] = (count / totalAnswers) * 100;
    });

    return answerPercentages;
  };

  const getAnswerColor = (answerType) => {
    switch (answerType) {
      case `${questionDetails?.answer1}`:
        return "bg-green-400";
      case `${questionDetails?.answer2}`:
        return "bg-violet-500";
      case `${questionDetails?.answer3}`:
        return "bg-yellow-300";

      case `${questionDetails?.answer4}`:
        return "bg-cyan-400";
      // Add more cases for other answer types
      default:
        return "bg-gray-500";
    }
  };

  // Get answer percentages
  const answerPercentages = getAnswerCounts();

  // console.log(answerPercentages);

  return (
    <div className="">
      <div className="w-[50%] flex-col  mx-auto max-sm:w-[98%] mb-10">
        <div className="w-full bg-[white] rounded-2xl  p-4 shadow-lg max-sm:p-3">
          <div className="flex justify-between w-full">
            {" "}
            <div className="flex items-center mt-2">
              <Image
                src={Avatar}
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full shadow-lg cursor-pointer"
              />
              <div className="flex-col ml-4">
                <div>
                  <span className="text-[15px] text-[#0a7685] font-semibold">
                    {questionDetails?.authorId?.firstname}{" "}
                    {questionDetails?.authorId?.lastname}
                  </span>
                </div>
                <div className="text-[8px] font-light text-[#848484b8]">
                  <span> {format(questionDetails?.createdAt)} </span>
                </div>
              </div>
            </div>
            <div className="flex items-center mx-2 text-[#0a7685]">
              <h1 className="flex mx-2 text-[13px]">{quesLikes}</h1>
              <div className="">
                {isLiked === true ? (
                  <AiFillHeart
                    onClick={handleLike}
                    size={20}
                    className="cursor-pointer"
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={handleLike}
                    size={20}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full my-5 h-[400px] mx-auto rounded-2xl overflow-hidden max-sm:w-[99%] max-sm:mx-auto flex items-center justify-center max-sm:h-[200px]">
            <Image
              alt=""
              src={questionDetails?.imageUrl}
              width={1000}
              height={200}
              className="object-cover"
            />
          </div>

          <div className="flex-col items-center">
            <h1 className="text-[20px] font-semibold text-[#0a7685] h-[50px] max-sm:text-[18px]">
              {questionDetails?.question}
            </h1>
            <div className="flex items-center justify-between w-full">
              <h1 className="p-2 px-5 rounded-full  bg-[#0fbbd3] text-[white] text-center text-[13px] max-sm:text-[12px]">
                <span>{questionDetails?.category}</span>
              </h1>
              {questionDetails?.authorId?._id.toString() ===
              session?.user?._id.toString() ? (
                <div className="flex items-center gap-2">
                  <Link href={`edit/${ctx.params.id}`}>
                    <HiOutlinePencilAlt size={25} className="text-gray-500" />
                  </Link>
                  <button
                    className="p-2 px-4 bg-red-500 rounded-full text-[13px] text-[white]"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {/* Answer Input */}
        <div className="flex justify-between mt-10 max-sm:w-full max-sm:block">
          {questionDetails?.quesType === "Multiple Choices" ? (
            <>
              <button
                className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer1)}
              >
                {questionDetails?.answer1}
              </button>

              <button
                className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer2)}
              >
                {questionDetails?.answer2}
              </button>

              <button
                className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer3)}
              >
                {questionDetails?.answer3}
              </button>

              <button
                className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer4)}
              >
                {questionDetails?.answer4}
              </button>
            </>
          ) : (
            <>
              <button
                className="flex justify-center items-center text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer1)}
              >
                {questionDetails?.answer1}
                <span className="ml-2">
                  <BsEmojiFrown size={20} />
                </span>
              </button>

              <button
                className="flex justify-center items-center  text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer2)}
              >
                {questionDetails?.answer2}
                <span className="ml-2">
                  <BsEmojiNeutral size={20} />
                </span>
              </button>

              <button
                className=" flex justify-center items-center  text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer3)}
              >
                {questionDetails?.answer3}
                <span className="ml-2">
                  <BsEmojiSmile size={20} />
                </span>
              </button>

              <button
                className="flex justify-center items-center  text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
                onClick={() => handleButtonClick(questionDetails?.answer4)}
              >
                {questionDetails?.answer4}
                <span className="ml-2">
                  <BsEmojiHeartEyes size={20} />
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Answer Pool */}
      <div className="mx-auto w-[50%] bg-[white] rounded-2xl mt-10 p-4 shadow-lg max-sm:p-3 max-sm:w-full mb-10">
        <h1 className="uppercase text-[15px] font-semibold text-[#0a7685]">
          Answer Pool
        </h1>
        <div className="flex flex-col ">
          {answers?.length > 0 ? (
            answers?.map((answer) => (
              <AnswerCard
                key={answer?.id}
                answer={answer}
                setAnswers={setAnswers}
              />
            ))
          ) : (
            <h1 className="text-[15px] text-center my-10">
              No Answers Be the first one
            </h1>
          )}
        </div>
      </div>

      <div className="mx-auto w-[50%] bg-[white] rounded-2xl mt-10 p-4 shadow-lg max-sm:p-3 max-sm:w-full mb-10">
        <h1 className="uppercase text-[15px] font-semibold text-[#0a7685] mb-5">
          Answer Distribution
        </h1>
        <ul>
          {Object.entries(answerPercentages).map(([answerType, percentage]) => (
            <li key={answerType} className="mb-2">
              <div className="flex flex-col ">
                <div className="flex justify-between mb-2">
                  <span className="mr-2 text-[10px] ">{`${answerType}`}</span>
                  <span className="text-[10px]">{`${percentage.toFixed(
                    2
                  )}%`}</span>
                </div>
                <div className={` rounded-lg bg-gray-200 `}>
                  <div
                    className={`h-3 rounded-full ${getAnswerColor(answerType)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QuestionPage;
