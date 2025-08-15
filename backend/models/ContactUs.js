import mongoose from "mongoose";

const ContactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { collection: "contactUs" } // explicitly set collection name
);

export default mongoose.models.ContactUs ||
  mongoose.model("ContactUs", ContactUsSchema);
