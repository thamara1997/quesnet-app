"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Avatar from "../../assets/Avatar.png";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format } from "timeago.js";

const QuestionCard = ({
  question: { question, desc, imageUrl, likes, authorId, _id, createdAt },
}) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [quesLikes, setQuesLikes] = useState(0);

  useEffect(() => {
    session && likes && setIsLiked(likes.includes(session?.user?._id));
    session && likes && setQuesLikes(likes.length);
  }, [likes, session]);

  const handleLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/question/${_id}/like`,
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
  return (
    <div className="w-[270px] h-[370px] rounded-2xl   shadow-lg max-sm:w-[100%] bg-white hover:scale-[101%] hover:duration-500">
      <div className="w-[250px] h-[250px] mt-[10px] mx-auto   overflow-hidden max-sm:w-[95%] max-sm:mx-auto">
        <Link href={`/question/${_id}`}>
          <Image
            src={imageUrl}
            alt="Question Image"
            className="rounded-2xl object-cover h-[250px]"
            width={400}
            height={30}
          />
        </Link>
      </div>
      <div className="px-[10px] mt-3">
        <h1 className="text-[15px] font-normal text-[#0a7685] h-[40px]">
          {question}
        </h1>
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <Image
              src={Avatar}
              alt="Avatar"
              width={30}
              height={30}
              className="rounded-full shadow-lg cursor-pointer"
            />
            <p className="text-[10px] font-semibold text-[#0a7785ad] mx-3">
              {authorId?.firstname} {authorId?.lastname}
              <span className="block text-[8px] font-light text-[#848484b8]">
                {format(createdAt)}
              </span>
            </p>
          </div>
          <div className="flex items-center mx-2 text-[#0a7685]">
            <h1 className="flex mx-2 text-[10px]">{quesLikes}</h1>
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
      </div>
    </div>
  );
};

export default QuestionCard;
