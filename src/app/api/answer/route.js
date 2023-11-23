import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Answer from "@/models/Answer";

export async function POST(req) {
  await db.connect();

  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "unauthorized (wrong or expired token" }),
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    let newAnswer = await Answer.create(body);
    newAnswer = await newAnswer.populate("authorId");

    return new Response(JSON.stringify(newAnswer), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
