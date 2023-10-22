import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Question from "@/models/Question";

export async function PUT(req, ctx) {
  await db.connect();

  const id = ctx.params.id;

  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  //console.log(token);

  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
      { status: 403 }
    );
  }

  try {
    const ques = await Question.findById(id);

    if (ques.likes.includes(decodedToken._id)) {
      ques.likes = ques.likes.filter(
        (id) => id.toString() !== decodedToken._id.toString()
      );
    } else {
      ques.likes.push(decodedToken._id);
    }

    await ques.save();

    return new Response(
      JSON.stringify({ msg: "Successfully interacted with the blog" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}
