import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Question from "@/models/Question";

export async function GET(req) {
  await db.connect();

  try {
    const questions = await Question.find({}).limit(16).populate("authorId");
    return new Response(JSON.stringify(questions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

export async function POST(req) {
  await db.connect();

  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "unauthorized (wrong or expired token" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const newQuestion = await Question.create(body);

    return new Response(JSON.stringify(newQuestion), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

// export async function GET(req) {
//   await db.connect();

//   try {
//     const questions = await Question.find({}).limit(16).populate("authorId");
//     return new Response(JSON.stringify(questions), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify(null), { status: 500 });
//   }
// }
