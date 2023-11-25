"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Avatar from "../../../assets/Avatar.png";

import { SlSocialGoogle } from "react-icons/sl";
import { SlSocialLinkedin } from "react-icons/sl";
import { SlSocialInstagram } from "react-icons/sl";
import QuestionCard from "@/components/questionCard/QuestionCard";

const Profile = (ctx) => {
  const { data: session } = useSession();

  const id = ctx.params._id;

  const [user, setUser] = useState();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(
        `http://localhost:3000/api/user/${ctx.params.id}`
      );

      const user = await res.json();

      setUser(user);

      console.log(user);
    }
    fetchUser();

    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3000/api/question", {
          method: "GET", // You can change the method based on your API route
          headers: {
            // Include any custom headers if needed
            "Content-Type": "application/json",
            // Add more headers as needed
          },
          cache: "no-store",
        });
        const allQuestions = await res.json();

        const filteredQuestions = allQuestions.filter(
          (question) => question.authorId?._id === ctx.params.id
        );

        setQuestions(filteredQuestions);
        console.log();
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    }
    fetchQuestions();
  }, [ctx.params.id]);

  console.log(questions);

  return (
    <div>
      <div className="w-[60%] flex-col   mx-auto max-sm:w-[98%] mb-10 ">
        <div className="w-full py-10 flex bg-[white] rounded-2xl justify-around p-4 shadow-lg max-sm:p-3 max-sm:block max-sm:mx-auto">
          <Image
            src={Avatar}
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full shadow-lg cursor-pointer max-sm:mx-auto"
          />
          <div className="flex flex-col items-center text-2xl text-[#0a7685]  w-[30%] max-sm:w-full">
            <h1 className="font-semibold">
              {user?.firstname} {user?.lastname}
            </h1>
            <h1 className="text-[10px]">Professional And Unique</h1>
            <div className="flex text-[20px] gap-3">
              <SlSocialGoogle />
              <SlSocialLinkedin />
              <SlSocialInstagram />
            </div>
            <button className="mt-16 text-center rounded-full w-[150px] h-[50px] bg-[white] text-[#0fbbd3] shadow-xl text-[15px] font-bold hover:bg-[#0fbbd3] hover:text-[white] max-sm:w-full max-sm:my-3">
              Edit Profile
            </button>
          </div>
        </div>
        <div className="flex justify-center w-full mx-auto mt-10 max-sm:w-[95%]">
          <div className="grid grid-cols-3 gap-10 max-sm:grid-cols-1">
            {questions?.length > 0 ? (
              questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))
            ) : (
              <h3 className="items-center w-full col-span-4 mt-10 text-center">
                You Do Not Have Any Question
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
