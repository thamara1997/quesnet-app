import db from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";
import Question from "@/models/Question";
import User from "@/models/User";

export async function GET(req, ctx) {
  await db.connect();

  const id = ctx.params.id;

  try {
    const question = await Question.findById(id)
      .populate("authorId")
      .select("-password");

    return new Response(JSON.stringify(question), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

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
    const body = await req.json();
    const question = await Question.findById(id).populate("authorId");

    if (question?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "only author can update his question" }),
        { status: 403 }
      );
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return new Response(JSON.stringify(updatedQuestion), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

export async function DELETE(req) {
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
    const question = await Question.findById(id).populate("authorId");

    if (question?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "only author can delete his Question" }),
        { status: 403 }
      );
    }

    await Question.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ msg: "Successfully Deleted Question" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 });
  }
}
