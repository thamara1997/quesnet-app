"use client";

import React, { useState } from "react";
import Image from "next/image";
import Background from "../../assets/background.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      password === "" ||
      email === "" ||
      firstname === "" ||
      lastname === ""
    ) {
      toast.error("Fill All Fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
      });
      console.log(await res.json());

      if (res.ok) {
        toast.success("Successfully registered the user");
        setTimeout(() => {
          signIn();
        }, 2000);
        return;
      } else {
        toast.error("Error occurred while Registering");
        return;
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  // show password
  const [showPw, setShowPw] = useState(false);
  const handleClickShowPw = () => {
    if (showPw) {
      setShowPw(false);
    } else {
      setShowPw(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center ">
        <div className=" mx-auto  w-[70%]  bg-white rounded-xl overflow-hidden max-sm:w-[98%]">
          <div className="relative w-full h-full max-sm:h-screen">
            <div className="max-sm:hidden">
              <Image
                src={Background}
                alt="Logo"
                className="object-cover w-full "
              />
            </div>
            <div className="absolute top-0 left-0 w-[50%] flex  justify-start h-full p-10 bg-[#0A7685] max-sm:relative max-sm:w-full">
              <div className="mt-[30px]  flex-col w-[90%] max-sm:w-[95%]">
                <h1 className="flex items-center text-[25px] text-white font-semibold uppercase">
                  Register
                </h1>

                <form className="flex-col mt-10 " onSubmit={handleSubmit}>
                  <div className="flex-row text-white  text-[13px] ">
                    <div className="flex justify-between gap-3 my-3">
                      <label className=" w-[50%]">
                        <span className="m-1 font-light">First Name</span>
                        <input
                          type="text"
                          className=" h-[2.5rem] w-full rounded-lg border-[1px] border-[#ffffff5d] bg-transparent px-4 mb-1"
                          placeholder="John"
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </label>
                      <label className=" w-[50%]">
                        <span className="m-1 font-light">Last Name</span>
                        <input
                          type="text"
                          className=" h-[2.5rem] w-full rounded-lg border-[1px] border-[#ffffff5d] bg-transparent px-4 mb-1"
                          placeholder="Smith"
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="my-3">
                      <label>
                        <span className="m-1 font-light">Email</span>
                        <input
                          type="email"
                          className=" h-[2.5rem] w-full rounded-lg border-[1px] border-[#ffffff5d] bg-transparent px-4 mb-1"
                          placeholder="example@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="flex justify-between gap-4 mt-3">
                      <label className="w-[100%]">
                        <span className="m-1 font-light">Password</span>
                        <input
                          type={showPw ? "text" : "Password"}
                          className=" h-[2.5rem] w-full rounded-lg border-[1px] border-[#ffffff5d] bg-transparent px-4 mb-1"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <h1
                          id="clear"
                          className="relative bottom-[30px] left-[94%] showPw"
                          onClick={handleClickShowPw}
                        >
                          {showPw ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </h1>
                      </label>
                    </div>
                    <div className="flex text-[10px] justify-between ">
                      <h1>Remember Me</h1>
                      <h1>Forgot Password</h1>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-8 bg-[#fff] px-5 py-2 rounded-lg text-[#0A7685] font-normal text-[15px] hover:bg-[#45b1bf] hover:text-[#fff] "
                    onClick={() => signIn()}
                  >
                    Register Now
                  </button>

                  <p className="flex justify-center my-4 text-[#fff]">or</p>

                  <button className="w-full  border-[1px] border-[#ffffff5d] flex items-center justify-center px-5 py-2 rounded-lg text-[#fff] font-normal text-[15px] ">
                    <span className="mx-3">
                      <FcGoogle />
                    </span>
                    Sign in with Google
                  </button>

                  <div className="flex my-4">
                    <h1 className="font-light text-white text-[10px]">
                      Have an Account?
                    </h1>
                    <Link href={"/login"}>
                      <h1 className="font-light text-cyan-300 ml-3 text-[10px]">
                        Log in
                      </h1>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
