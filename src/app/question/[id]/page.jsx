"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";

const QuestionPage = (ctx) => {
  const [questionDetails, setQuestionData] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [quesLikes, setQuesLikes] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  //console.log(questionDetails);

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
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {};

  return (
    <div>
      <div>
        <Image
          alt=""
          src={questionDetails?.imageUrl}
          width={200}
          height={200}
        />
        {questionDetails?.authorId?._id.toString() ===
        session?.user?._id.toString() ? (
          <div>
            <Link href={`question/edit/${ctx.params.id}`}>Edit</Link>
            <button className="p-2 bg-red-600 bg" onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : (
          <div>
            Author : <span>{questionDetails?.authorId?.username}</span>
          </div>
        )}
        <h1>{questionDetails?.question}</h1>
        <h1>{questionDetails?.answer1}</h1>
        <h1>{questionDetails?.answer2}</h1>
        <h1>{questionDetails?.answer3}</h1>
        <h1>{questionDetails?.answer4}</h1>
        <div>
          {" "}
          <h1>
            {" "}
            Category : <span>{questionDetails?.category}</span>
          </h1>
        </div>
        <div>
          <h1>{quesLikes}</h1>
          {isLiked ? (
            <div onClick={handleLike}>
              <AiFillLike size={20} />
            </div>
          ) : (
            <div onClick={handleLike}>
              <AiOutlineLike size={20} />
            </div>
          )}
        </div>
        <div>
          Posted : <span> {format(questionDetails?.createdAt)} </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
