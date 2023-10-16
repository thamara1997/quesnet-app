import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      min: 6,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Physics",
        "Chemistry",
        "Statistics",
        "Mathematics",
      ],
    },
    quesType: {
      type: String,
      required: true,
      enum: ["Multiple Choices", "Satisfactory"],
    },
    answer1: {
      type: String,
      required: true,
    },
    answer2: {
      type: String,
      required: true,
    },
    answer3: {
      type: String,
      required: true,
    },
    answer4: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose?.models?.Question ||
  mongoose.model("Question", QuestionSchema);
