import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Answer from "@/models/Answer";

export async function GET(req, ctx) {
  await db.connect();

  const id = ctx.params.id;

  try {
    const Answers = await Answer.find({ blogId: id }).populate("authorId");

    return new Response(JSON.stringify(Answers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

export async function DELETE(req, ctx) {
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
    const answer = await Answer.findById(id).populate("authorId");

    if (answer?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "only author can delete his Answer" }),
        { status: 403 }
      );
    }

    await Answer.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ msg: "Successfully Deleted Answer" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}
