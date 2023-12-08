import mongoose from "mongoose";

const recoverCollection = "recovers";

const recoverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  expire_at: {
    type: Date,
    required: true,
  },
});

const recoverModel = mongoose.model(recoverCollection, recoverSchema);

export { recoverModel };
