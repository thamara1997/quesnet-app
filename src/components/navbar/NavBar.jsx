"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/logo.png";
import Avatar from "../../assets/Avatar.png";
import { AiOutlineClose } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import logoSmall from "../../assets/logosmall.png";
import { signIn, signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session } = useSession();

  const handleShowDropDown = () => setShowDropdown((prev) => true);
  const handleHideDropDown = () => setShowDropdown((prev) => false);

  const loggedIn = false;
  return (
    <div className="sticky flex justify-between p-[20px] px-10 items-center max-sm:w-full max-sm:px-5">
      <div className="left">
        <Link href="/">
          <div className="flex items-center justify-center px-3 py-2 bg-white rounded-full shadow-lg max-sm:hidden">
            <Image src={logo} alt="Logo" width={80} />
          </div>
          <div className="flex items-center justify-center px-2 py-2 bg-white rounded-full shadow-lg sm:hidden">
            <Image src={logoSmall} alt="Logo" width={20} />
          </div>
        </Link>
      </div>
      <div className="center">
        {session?.user ? (
          <>
            <Link href={"/create-question"}>
              <div className="flex items-center justify-between bg-white w-[500px] h-[35px] rounded-lg shadow-lg max-sm:w-[130px] max-sm:rounded-full max-sm:ml-3">
                <div className="bg-[#0a7685] rounded-lg  flex w-[30%] h-[35px] max-sm:w-full max-sm:rounded-full">
                  <h1 className="flex items-center mx-auto text-white text-[13px]">
                    Create Ques
                  </h1>
                </div>
                <div className="flex items-center p-2 max-sm:hidden">
                  <CiImageOn size={20} />
                </div>
              </div>
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="right">
        {session?.user ? (
          <>
            <div className="flex items-center justify-center ">
              <div className="flex items-center mx-10">
                <FaBell
                  size={25}
                  className="text-[#0a7685] hover:text-cyan-300"
                />
              </div>
              <Image
                src={Avatar}
                alt="Avatar"
                width={30}
                height={30}
                onClick={handleShowDropDown}
                className="rounded-full shadow-lg cursor-pointer"
              />
            </div>
            {showDropdown && (
              <div className="absolute flex flex-col items-start gap-2 p-3 rounded-lg top-[80px] right-[40px] bg-white shadow-lg text-lg">
                <div className="flex items-center justify-between gap-5 text-[15px]">
                  <Link
                    href="/profile"
                    onClick={handleHideDropDown}
                    className="px-3 hover:text-[#0a7685]"
                  >
                    Profile
                  </Link>
                  <AiOutlineClose
                    onClick={handleHideDropDown}
                    className="hover:text-[#0a7685]"
                  />
                </div>

                <button
                  onClick={() => {
                    signOut();
                    handleHideDropDown();
                  }}
                  className="w-full px-4 buttonDarkBlue text-[15px]"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <button
                className="text-lg buttonOutlineDarkBlue"
                onClick={() => {
                  signIn();
                }}
              >
                Login
              </button>
              <Link
                href="/register "
                className="text-lg buttonOutlineDarkBlue "
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
