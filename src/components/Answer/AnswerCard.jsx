import React from "react";
import { useSession } from "next-auth/react";
import Avatar from "../../assets/Avatar.png";
import Image from "next/image";
import { format } from "timeago.js";

import { MdDeleteOutline } from "react-icons/md";

const AnswerCard = ({ answer, setAnswers }) => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  //console.log(answer?.answer);

  const handleDeleteAnswer = async () => {
    try {
      await fetch(`http://localhost:3000/api/answer/${answer?._id}`, {
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
              {answer?.authorId?.firstname}
            </h1>
            <span className="text-[10px] text-gray-400">
              {format(answer?.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="p-1 px-3 mx-4 bg-[#0fbbd3] rounded-full text-[15px] font-semibold text-white">
            {answer?.answer}
          </h1>
          <div className="text-black ">
            {session?.user?._id === answer?.authorId?._id && (
              <MdDeleteOutline
                onClick={handleDeleteAnswer}
                size={25}
                className="text-black"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
