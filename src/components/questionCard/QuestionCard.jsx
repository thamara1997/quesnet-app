import React from "react";
import Image from "next/image";
import Avatar from "../../assets/Avatar.png";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";

const QuestionCard = ({
  question: { title, desc, img, authorId, reacted, count },
}) => {
  return (
    <div className="w-[270px] h-[370px] rounded-2xl  shadow-lg max-sm:w-[100%] bg-white">
      <div className="w-[250px] h-[250px] mt-[10px] mx-auto   overflow-hidden max-sm:w-[95%] max-sm:mx-auto">
        <Image
          src={img}
          alt="Question Image"
          className="rounded-2xl object-cover h-[250px]"
        />
      </div>
      <div className="px-[10px] mt-3">
        <h1 className="text-[15px] font-normal text-[#0a7685] h-[40px]">
          {title}
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
              {authorId}
              <span className="block text-[8px] font-light text-[#848484b8]">
                1st of january
              </span>
            </p>
          </div>
          <div className="flex items-center mx-2 text-[#0a7685]">
            <h1 className="flex mx-2 text-[10px]">{count}</h1>
            {reacted === true ? (
              <>
                <AiFillHeart size={20} />
              </>
            ) : (
              <>
                <AiOutlineHeart size={20} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
