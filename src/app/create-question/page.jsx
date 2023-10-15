"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineFileImage } from "react-icons/ai";

const CreateQuestion = () => {
  const CLOUD_NAME = "deyb6dxpy";
  const UPLOAD_PRESET = "quesnet-project";
  //const PUBLIC_ID = "sample_image";

  const [question, setQuestion] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [quesType, setQuesType] = useState("Multiple Choices");
  const [answer1, setAnswer1] = useState("Don't Agree");
  const [answer2, setAnswer2] = useState("I don't Know");
  const [answer3, setAnswer3] = useState("I agree");
  const [answer4, setAnswer4] = useState("Totally agree");

  const { data: session, status } = useSession();
  const router = useRouter();

  //   console.log(session);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !photo ||
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
      const imageUrl = await uploadImage();

      const res = await fetch("http://localhost:3000/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          quesType,
          question,
          imageUrl,
          category,
          answer1,
          answer2,
          answer3,
          answer4,
          authorId: session?.user?._id,
        }),
      });

      console.log(res);

      if (!res.ok) {
        throw new Error("Error Occurred");
      }

      const ques = await res.json();
      router.push(`question/${ques?._id}`);
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
        <form action="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="image">
              Upload Image <AiOutlineFileImage />
            </label>
            <input
              id="image"
              type="file"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <select
            value={quesType}
            onChange={(e) => setQuesType(e.target.value)}
          >
            <option value="Multiple Choices">Multiple Choices</option>
            <option value="Satisfactory">Satisfactory</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Statistics">Statistics</option>
            <option value="Mathematics">Mathematics</option>
          </select>
          <input
            type="text"
            placeholder="Enter Your Question"
            onChange={(e) => setQuestion(e.target.value)}
          />
          {quesType === "Multiple Choices" ? (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Answer 1"
                  onChange={(e) => setAnswer1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Answer 2"
                  onChange={(e) => setAnswer2(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Answer 3"
                  onChange={(e) => setAnswer3(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Answer 4"
                  onChange={(e) => setAnswer4(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                />
                <input
                  type="text"
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                />
                <input
                  type="text"
                  value={answer3}
                  onChange={(e) => setAnswer3(e.target.value)}
                />
                <input
                  type="text"
                  value={answer4}
                  onChange={(e) => setAnswer4(e.target.value)}
                />
              </div>
            </>
          )}

          <button>Publish Question</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateQuestion;
