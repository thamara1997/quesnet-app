"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Profile = (ctx) => {
  const { data: session } = useSession();

  const id = ctx.params._id;

  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(
        `http://localhost:3000/api/user/${ctx.params.id}`
      );

      const user = await res.json();

      setUser(user);

      console.log(user);
    }
    fetchQuestion();
  }, [ctx.params.id]);

  return (
    <div>
      <h1>{user.firstname}</h1>
      <h1>{user.lastname}</h1>
    </div>
  );
};

export default Profile;
