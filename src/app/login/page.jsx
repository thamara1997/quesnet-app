"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Background from "../../assets/background.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "" || email === "") {
      toast.error("Fill All Fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error == null) {
        router.push("/");
      } else {
        toast.error("Error occurred while signing");
      }
    } catch (error) {}
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
        <div className=" mx-auto  w-[70%]  bg-white rounded-xl overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={Background}
              alt="Logo"
              className="object-cover w-full "
            />

            <div className="absolute top-0 left-0 w-[50%] flex  justify-start h-full p-10 bg-[#0A7685]">
              <div className="mt-[50px]  flex-col w-[90%]">
                <h1 className="flex items-center text-[25px] text-white font-semibold uppercase">
                  Login
                </h1>

                <form className="flex-col mt-10 " onSubmit={handleSubmit}>
                  <div className="flex-row text-white  text-[13px] ">
                    <div className="my-3">
                      <label>
                        <span className="m-1 font-light">Email</span>
                        <input
                          type="email"
                          // ref={register}
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
                  >
                    Login
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
                      Not a member yet?
                    </h1>
                    <Link href={"/register"}>
                      <h1 className="font-light text-cyan-300 ml-3 text-[10px]">
                        Create Account
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

export default Login;
