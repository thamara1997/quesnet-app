import React from "react";
import { useSession } from "next-auth/react";
import Avatar from "../../assets/Avatar.png";
import Image from "next/image";
import { format } from "timeago.js";

import { AiOutlineDelete } from "react-icons/ai";

const AnswerCard = (answer, setAnswers) => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const handleDeleteAnswer = async () => {
    try {
      await fetch(`https://localhost:3000/api/answers/${answer?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      setAnswers((prev) => {
        return [...prev].filter((c) => c?._id !== answer?._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between w-full p-4">
        <div className="flex items-center justify-start">
          <Image
            src={Avatar}
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full shadow-lg cursor-pointer"
          />
          <div className="flex flex-col justify-start mx-2">
            <h1 className="text-[15px] font-medium">
              {answer?.authorId?.username}
            </h1>
            <span className="text-[10px] text-gray-400">
              {format(answer?.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="">
            {session?.user?._id === answer?.authorId?._id && (
              <AiOutlineDelete onClick={handleDeleteAnswer} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
