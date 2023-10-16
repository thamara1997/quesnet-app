import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Question from "@/models/Question";

export async function PUT(req, ctx) {
  await db.connect();

  const id = ctx.params.id;

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
    const question = await Question.findById(id);

    if (question.likes.includes(decodedToken._id)) {
      question.likes = question.likes.filter(
        (id) => id.toString() !== decodedToken._id.toString()
      );
    } else {
      question.likes.push(decodedToken._id);
    }

    await Question.save();

    return new Response(
      JSON.stringify({ msg: "Successfully interacted with the Question" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}
