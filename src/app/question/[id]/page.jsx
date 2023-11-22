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

const QuestionPage = (ctx) => {
  const [questionDetails, setQuestionData] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [quesLikes, setQuesLikes] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const [answers, setAnswers] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  // useEffect(() => {
  //   console.log("Selected Answer:", selectedAnswer);
  // }, [selectedAnswer]);

  useEffect(() => {
    async function fetchAnswers() {
      const res = await fetch(
        `http://localhost:3000/api/answers/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const answers = await res.json();

      setAnswers(answers);
    }
    fetchAnswers();
  }, []);

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

  const handleButtonClick = async () => {
    // console.log(selectedAnswer);
    try {
      const body = {
        questionId: ctx.params.id,
        authorId: session?.user?._id,
        answer: selectedAnswer,
      };

      console.log(body);

      const res = await fetch(`http://localhost:3000/api/answers`, {
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

  return (
    <div>
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
          <div className="w-[full] my-5  mx-auto  rounded-2xl overflow-hidden max-sm:w-[99%] max-sm:mx-auto">
            <Image
              alt=""
              src={questionDetails?.imageUrl}
              width={1000}
              height={200}
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
          <button
            className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
            onClick={() =>
              handleButtonClick(setSelectedAnswer(questionDetails?.answer1))
            }
          >
            {questionDetails?.answer1}
          </button>

          <button
            className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
            onClick={() =>
              handleButtonClick(setSelectedAnswer(questionDetails?.answer2))
            }
          >
            {questionDetails?.answer2}
          </button>

          <button
            className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
            onClick={() =>
              handleButtonClick(setSelectedAnswer(questionDetails?.answer3))
            }
          >
            {questionDetails?.answer3}
          </button>

          <button
            className="text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3"
            onClick={() =>
              handleButtonClick(setSelectedAnswer(questionDetails?.answer4))
            }
          >
            {questionDetails?.answer4}
          </button>
        </div>
      </div>
      {/* Answer Pool */}
      <div className="mx-auto w-[50%] bg-[white] rounded-2xl mt-10 p-4 shadow-lg max-sm:p-3">
        <h1 className="uppercase text-[15px] font-semibold text-[#0a7685]">
          Answer Pool
        </h1>
        <div className="flex">
          {answers?.length > 0 ? (
            answers?.map((answer) => (
              <AnswerCard
                key={answer?.id}
                answer={answer}
                setAnswers={setAnswers}
              />
            ))
          ) : (
            <h1 className="text-[15px] text-center">
              No Answers Be the first one
            </h1>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QuestionPage;
