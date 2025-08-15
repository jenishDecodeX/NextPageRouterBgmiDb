import dbConnect from "../../backend/config/dbConnect";
import ContactUs from "../../backend/models/ContactUs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newContact = new ContactUs({ name, email, message });
      await newContact.save();

      res.status(200).json({ message: "Contact saved successfully!" });
    } catch (err) {
      console.error("Error saving contact:", err);
      res.status(500).json({ message: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      const contacts = await ContactUs.find().sort({ date: -1 });
      res.status(200).json(contacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
