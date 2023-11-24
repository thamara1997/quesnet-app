"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineFileImage } from "react-icons/ai";

import { BsEmojiSmile } from "react-icons/bs";
import { BsEmojiNeutral } from "react-icons/bs";
import { BsEmojiFrown } from "react-icons/bs";
import { BsEmojiHeartEyes } from "react-icons/bs";

const EditQuestion = (ctx) => {
  const CLOUD_NAME = "deyb6dxpy";
  const UPLOAD_PRESET = "quesnet-project";

  const [question, setQuestion] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [quesType, setQuesType] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (quesType === "Satisfactory") {
      setAnswer1("Unsatisfied");
      setAnswer2("Neutral");
      setAnswer3("Satisfied");
      setAnswer4("Very Satisfied");
    }
  }, [quesType]);

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(
        `http://localhost:3000/api/question/${ctx.params.id}`
      );

      const question = await res.json();

      setQuestion(question?.question);
      setCategory(question.category);
      setQuesType(question.quesType);
      setAnswer1(question.answer1);
      setAnswer2(question.answer2);
      setAnswer3(question.answer3);
      setAnswer4(question.answer4);
    }
    fetchQuestion();
  }, [ctx.params.id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !question ||
      !category ||
      !quesType ||
      !answer1 ||
      !answer2 ||
      !answer3 ||
      !answer4
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      let imageUrl = null;
      if (photo) {
        imageUrl = await uploadImage();
      }

      const body = {
        quesType,
        question,
        category,
        answer1,
        answer2,
        answer3,
        answer4,
      };

      console.log(body);

      if (imageUrl != null) {
        body.imageUrl = imageUrl;
      }

      const res = await fetch(
        `http://localhost:3000/api/question/${ctx.params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",

          body: JSON.stringify(body),
        }
      );

      console.log(res);

      if (!res.ok) {
        throw new Error("Error Occurred");
      } else {
        const ques = await res.json();

        toast.success("Post Published successfully");
        setTimeout(() => {
          router.push(`/question/${ques?._id}`);
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (e) => {
    if (!photo) return;

    const formData = new FormData();

    formData.append("file", photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      const imageUrl = data["secure_url"];
      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="w-[50%] flex-col  mx-auto max-sm:w-[98%]">
          <div className="w-full p-4 rounded-2xl max-sm:p-3">
            <form action="" onSubmit={handleSubmit}>
              <div className="w-[100%] h-[300px] flex items-center justify-center p-4 border-dotted border-gray-500 border-[1px] rounded-2xl mb-5">
                <div className="">
                  <label
                    htmlFor="image"
                    style={{
                      cursor: "pointer",
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div className="items-center justify-center w-full text-center">
                      <div>
                        <AiOutlineFileImage size={40} />
                      </div>
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-between w-full gap-4">
                <div className="w-[50%]">
                  <h1 className="text-[15px] text-[#0a7685] font-semibold my-2">
                    Question Type
                  </h1>{" "}
                  <select
                    value={quesType}
                    onChange={(e) => {
                      setQuesType(e.target.value);
                    }}
                    className="p-3 bg-white rounded-full shadow-xl text-[#0fbbd3] w-full text-center"
                  >
                    <option value="Multiple Choices">Multiple Choices</option>
                    <option value="Satisfactory">Satisfactory</option>
                  </select>
                </div>

                <div className="w-[50%]">
                  <h1 className="text-[15px] text-[#0a7685] font-semibold my-2">
                    Category
                  </h1>{" "}
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 bg-white rounded-full shadow-xl text-[#0fbbd3] w-full text-center"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
              </div>

              <div>
                <h1 className="text-[15px] text-[#0a7685] font-semibold my-2">
                  Question
                </h1>{" "}
                <input
                  type="text"
                  placeholder="Enter Your Question"
                  onChange={(e) => setQuestion(e.target.value)}
                  value={question}
                  className="w-full p-3 bg-white shadow-xl rounded-2xl "
                />
              </div>
              {quesType === "Multiple Choices" ? (
                <>
                  <div>
                    <h1 className="text-[15px] text-[#0a7685] font-semibold my-2">
                      Answers
                    </h1>
                    <div className="grid w-full grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <input
                        type="text"
                        placeholder="Answer 1"
                        value={answer1}
                        onChange={(e) => setAnswer1(e.target.value)}
                        className="p-3 rounded-full shadow-xl"
                      />
                      <input
                        type="text"
                        placeholder="Answer 2"
                        value={answer2}
                        onChange={(e) => setAnswer2(e.target.value)}
                        className="p-3 rounded-full shadow-xl"
                      />
                      <input
                        type="text"
                        placeholder="Answer 3"
                        value={answer3}
                        onChange={(e) => setAnswer3(e.target.value)}
                        className="p-3 rounded-full shadow-xl"
                      />
                      <input
                        type="text"
                        placeholder="Answer 4"
                        value={answer4}
                        onChange={(e) => setAnswer4(e.target.value)}
                        className="p-3 rounded-full shadow-xl"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="text-[15px] text-[#0a7685] font-semibold my-2">
                      Answers
                    </h1>
                    <div className="grid w-full grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value="Unsatisfied"
                          className="w-full p-3 rounded-full shadow-xl"
                        />
                        <BsEmojiFrown
                          size={20}
                          className="text-[#0a7685] absolute top-4 right-4 flex items-center pointer-events-none"
                        />
                      </div>

                      <div className="relative w-full">
                        <input
                          type="text"
                          value="Neutral"
                          className="w-full p-3 rounded-full shadow-xl"
                        />
                        <BsEmojiNeutral
                          size={20}
                          className="text-[#0a7685] absolute top-4 right-4 flex items-center pointer-events-none"
                        />
                      </div>

                      <div className="relative w-full">
                        <input
                          type="text"
                          value="Satisfied"
                          className="w-full p-3 rounded-full shadow-xl"
                        />
                        <BsEmojiSmile
                          size={20}
                          className="text-[#0a7685] absolute top-4 right-4 flex items-center pointer-events-none"
                        />
                      </div>

                      <div className="relative w-full">
                        <input
                          type="text"
                          value="Very Satisfied"
                          className="w-full p-3 rounded-full shadow-xl"
                        />
                        <BsEmojiHeartEyes
                          size={20}
                          className="text-[#0a7685] absolute top-4 right-4 flex items-center pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button className="bg-[#0a7685] w-full rounded-full p-2 my-5 text-[white]">
                Edit Question
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditQuestion;
