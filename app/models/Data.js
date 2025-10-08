import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const DataSchema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    }, 
    url: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true },
    password: { type: String, required: true }, 
    remarks: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Data || mongoose.model("Data", DataSchema);