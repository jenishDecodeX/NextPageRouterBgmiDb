import dbConnect from "@/backend/config/dbConnect";
import TournamentTeam from "@/backend/models/TournamentTeam";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const newEntry = new TournamentTeam(req.body);
      await newEntry.save();
      return res.status(200).json({ message: "Registration saved successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Error saving registration", details: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const data = await TournamentTeam.find().sort({ registeredAt: -1 });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching tournaments", details: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing tournament ID" });

      const deleted = await TournamentTeam.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Tournament not found" });

      return res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Error deleting tournament", details: err.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const updatedEntry = req.body;
      const id = updatedEntry.id || updatedEntry._id; // ✅ handle both cases

      if (!id) {
        return res.status(400).json({ error: "Missing tournament ID in request body" });
      }

      const updated = await TournamentTeam.findByIdAndUpdate(id, updatedEntry, { new: true });

      if (!updated) return res.status(404).json({ error: "Tournament not found" });

      return res.status(200).json({ message: "Tournament updated successfully", data: updated });
    } catch (err) {
      return res.status(500).json({ error: "Error updating tournament", details: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
